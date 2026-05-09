# eventlight — Backend Requirements

**Version:** 2.0  
**Stack:** Python · Django · Django REST Framework  
**Auth:** Token-based (`Authorization: Token <token>`)  
**Base URL:** `http://localhost:8000/api` (dev) · configured via `VITE_API_URL` on the frontend

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Authentication](#2-authentication)
3. [Categories](#3-categories)
4. [Events](#4-events)
5. [RSVP / Attendance](#5-rsvp--attendance)
6. [Likes & Saves](#6-likes--saves)
7. [Notifications](#7-notifications)
8. [User Profile & Preferences](#8-user-profile--preferences)
9. [Data Models — Complete Field Reference](#9-data-models--complete-field-reference)
10. [Enumerations](#10-enumerations)
11. [Error Response Format](#11-error-response-format)
12. [Pagination](#12-pagination)
13. [Image Uploads](#13-image-uploads)
14. [CORS & Security](#14-cors--security)
15. [New Features to Implement](#15-new-features-to-implement)
16. [Implementation Priority](#16-implementation-priority)
17. [Frontend ↔ Backend Contract Checklist](#17-frontend--backend-contract-checklist)

---

## 1. Design Principles

Every API decision should serve this goal: **a user discovers an event in as few taps as possible, then shows up.**

Rules:
- **Never make the frontend hardcode data that the backend owns.** Categories, languages, age groups, event types — all of these must come from the API. If the frontend hardcodes them, any backend change breaks the product silently.
- **Every list endpoint is paginated.** No exceptions. Returning unlimited data is a performance time bomb.
- **Auth-aware responses.** When a logged-in user fetches events, the response must include `is_liked`, `is_saved`, `is_rsvped` flags so the frontend can render the correct UI state in one request.
- **Consistent error shapes.** Every error returns `{ "detail": "string" }` or `{ "field": ["error"] }`. No surprises.
- **Timestamps are always ISO 8601 UTC.** `"2024-12-01T09:00:00Z"`. Never plain dates without time.

---

## 2. Authentication

All auth endpoints live under `/api/auth/`.

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/auth/register/` | No | Register new user |
| `POST` | `/api/auth/login/` | No | Log in, receive token |
| `POST` | `/api/auth/logout/` | Yes | Invalidate token |
| `GET` | `/api/auth/user/` | Yes | Get current user profile |
| `PATCH` | `/api/auth/user/` | Yes | Update profile fields |
| `POST` | `/api/auth/password/change/` | Yes | Change password |
| `POST` | `/api/auth/password/reset/` | No | Request password reset email |
| `POST` | `/api/auth/password/reset/confirm/` | No | Confirm reset with token |

### `POST /api/auth/register/`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "Desmond",
  "last_name": "Egya",
  "username": "desmond_e"
}
```

**Response `201`:**
```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4",
  "user": { ...User object... }
}
```

### `POST /api/auth/login/`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response `200`:**
```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4",
  "user": { ...User object... }
}
```

> The `user` object must be returned on both login and register. The frontend uses it immediately to render the authenticated state — a separate `GET /api/auth/user/` call after login is wasteful.

### `GET` / `PATCH /api/auth/user/`

Returns or updates the full User object (see [Section 9](#9-data-models--complete-field-reference)).

`PATCH` accepts any subset of updatable fields. Returns the full updated User object.

---

## 3. Categories

> **This is the most important change from the previous implementation.** Categories are currently hardcoded on the frontend in three places: the category filter bar, the AddEvent form, and the Settings preferences page. This is unacceptable — any new category added on the backend won't appear in the UI, and any category removed on the backend will still show. Categories must be a backend resource.

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/categories/` | No | List all active categories |
| `POST` | `/api/categories/` | Admin only | Create a category |
| `PATCH` | `/api/categories/:id/` | Admin only | Update a category |
| `DELETE` | `/api/categories/:id/` | Admin only | Deactivate a category |

### `GET /api/categories/`

No pagination required — there will never be hundreds of categories. Return the full list.

**Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Worship",
    "slug": "worship",
    "icon": "heart",
    "description": "Worship and praise gatherings",
    "events_count": 42,
    "is_active": true
  },
  {
    "id": 2,
    "name": "Conference",
    "slug": "conference",
    "icon": "mic",
    "description": "Conferences and summits",
    "events_count": 18,
    "is_active": true
  }
]
```

**Field notes:**
- `slug` — URL-safe identifier used as the filter value: `GET /api/events/?category=worship`
- `icon` — a string key the frontend maps to an icon component (e.g. `"heart"` → `FiHeart`). This decouples icon choice from the backend while still giving the backend control over which icon concept to suggest. See the icon map below.
- `events_count` — count of approved events in this category. Used to show/hide empty categories.
- `is_active` — only active categories are returned to public users.

### Icon key map (frontend reference)

| `icon` value | Renders as |
|---|---|
| `"heart"` | Worship, Fellowship |
| `"music"` | Music |
| `"mic"` | Conference |
| `"book"` | Seminar, Teaching |
| `"sun"` | Prayer |
| `"award"` | Youth |
| `"message"` | Outreach |
| `"users"` | Community |
| `"star"` | Featured / Special |
| `"camera"` | Arts |
| `"zap"` | All (default) |

### Initial seed data

Seed the database with these categories on first deploy:

| name | slug | icon |
|------|------|------|
| Worship | worship | heart |
| Music | music | music |
| Conference | conference | mic |
| Seminar | seminar | book |
| Fellowship | fellowship | users |
| Prayer | prayer | sun |
| Youth | youth | award |
| Outreach | outreach | message |
| Teaching | teaching | book |
| Children | children | star |

### Why `slug` matters

The frontend filters events with `?category=worship`. When categories are fetched dynamically, the `slug` is what gets sent as the filter value. The `name` is display-only. Never filter by `id` — slugs are human-readable and stable across environments.

---

## 4. Events

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/events/` | No (auth-aware) | Paginated, filtered event list |
| `POST` | `/api/events/` | Yes | Create an event |
| `GET` | `/api/events/:id/` | No (auth-aware) | Single event detail |
| `PATCH` | `/api/events/:id/` | Yes (owner) | Update event |
| `DELETE` | `/api/events/:id/` | Yes (owner) | Delete event |
| `GET` | `/api/events/:id/related/` | No | Events in the same category |
| `GET` | `/api/events/liked/` | Yes | Current user's liked events |
| `GET` | `/api/events/saved/` | Yes | Current user's saved events |
| `GET` | `/api/events/my-events/` | Yes | Events created by current user |
| `GET` | `/api/events/attending/` | Yes | Events user has RSVPed to |

### `GET /api/events/`

Returns only `approval_status = "approved"` events to the public.

**Query parameters:**

| Param | Type | Example | Notes |
|-------|------|---------|-------|
| `search` | string | `?search=shiloh` | Full-text on `title`, `description`, `location` |
| `category` | string | `?category=worship` | Matches category `slug` |
| `pricing` | string | `?pricing=free` | `free` or `paid` |
| `language` | string | `?language=english` | Exact match on slug |
| `age_group` | string | `?age_group=young_adults` | Exact match on slug |
| `is_featured` | bool | `?is_featured=true` | Featured events only |
| `ordering` | string | `?ordering=-date` | Prefix `-` for descending |
| `page` | int | `?page=2` | Page number |
| `page_size` | int | `?page_size=12` | Default 12, max 50 |

**Ordering fields allowed:** `date`, `created_at`, `title` (prefix `-` for descending)

**Response `200`:**
```json
{
  "count": 143,
  "next": "http://localhost:8000/api/events/?page=2",
  "previous": null,
  "results": [ ...Event[] ]
}
```

**Auth-awareness:** When the request includes a valid `Authorization` header, each event in `results` must include `is_liked`, `is_saved`, and `is_rsvped` computed for that user. When unauthenticated, these fields are `false` — not omitted.

### `POST /api/events/`

Accepts `multipart/form-data` when an image is included, otherwise `application/json`.

**Request body:**
```json
{
  "title": "Sunday Night Worship",
  "description": "A night of praise and worship...",
  "date": "2024-12-01T09:00:00Z",
  "end_date": "2024-12-01T12:00:00Z",
  "location": "Faith Tabernacle, 12 Church Street, Lagos",
  "location_lat": 6.5244,
  "location_lng": 3.3792,
  "pricing": "free",
  "ticket_price": null,
  "category": "worship",
  "language": "english",
  "age_group": "all_ages",
  "capacity": 500,
  "image": "<File>"
}
```

**Response `201`:** The created Event object.

The event is created with `approval_status = "pending"`. It will not appear in the public event list until an admin approves it. A notification is sent to the organizer when the status changes.

### Event object shape (response)

```json
{
  "id": 12,
  "title": "Sunday Night Worship",
  "description": "A night of praise...",
  "date": "2024-12-01T09:00:00Z",
  "end_date": "2024-12-01T12:00:00Z",
  "location": "Faith Tabernacle, 12 Church Street, Lagos",
  "location_lat": 6.5244,
  "location_lng": 3.3792,
  "pricing": "free",
  "ticket_price": null,
  "category": {
    "id": 1,
    "name": "Worship",
    "slug": "worship",
    "icon": "heart"
  },
  "language": "english",
  "age_group": "all_ages",
  "capacity": 500,
  "rsvp_count": 87,
  "is_rsvped": false,
  "is_featured": false,
  "approval_status": "approved",
  "rejection_reason": null,
  "image": "https://yourdomain.com/media/events/cover.jpg",
  "created_by": {
    "id": 1,
    "first_name": "Desmond",
    "last_name": "Egya"
  },
  "is_liked": false,
  "is_saved": false,
  "likes_count": 45,
  "saves_count": 23,
  "created_at": "2024-11-01T12:00:00Z",
  "updated_at": "2024-11-05T08:30:00Z"
}
```

> Note: `category` is a **nested object**, not a string. The frontend uses `event.category.slug` for filtering and `event.category.name` for display. If the backend currently returns `category` as a plain string, this needs to change.

### `GET /api/events/:id/related/`

Returns up to 6 approved events in the same category, excluding the current event, ordered by `date`.

**Response `200`:**
```json
{
  "count": 4,
  "results": [ ...Event[] ]
}
```

### `GET /api/events/liked/`, `GET /api/events/saved/`, `GET /api/events/my-events/`, `GET /api/events/attending/`

These return flat `Event[]` arrays (no pagination). They represent personal collections that are small by nature.

For `my-events`, include events of all `approval_status` values so the organizer can see pending and rejected events.

---

## 5. RSVP / Attendance

> **New feature.** An event platform where you can't say "I'm going" is incomplete. RSVP tells the organizer how many people to expect, lets the frontend show social proof ("87 people are going"), and enables reminder notifications to the right users.

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/events/:id/rsvp/` | Yes | Toggle RSVP (on/off) |
| `GET` | `/api/events/:id/attendees/` | Yes (owner only) | List of attendees |
| `GET` | `/api/events/attending/` | Yes | Events user has RSVPed to |

### `POST /api/events/:id/rsvp/`

Toggle — if the user has not RSVPed, create one. If they have, cancel it.

**Response `200`:**
```json
{
  "rsvped": true,
  "rsvp_count": 87,
  "message": "You're going! We'll remind you before the event."
}
```

If `capacity` is set and the event is full: return `400` with `{ "detail": "This event is at full capacity." }`

### `GET /api/events/:id/attendees/`

Owner-only. Returns basic info, not full user profiles.

**Response `200`:**
```json
{
  "count": 87,
  "results": [
    {
      "id": 1,
      "first_name": "Ada",
      "last_name": "Obi",
      "email": "ada@example.com",
      "rsvped_at": "2024-11-20T10:00:00Z"
    }
  ]
}
```

---

## 6. Likes & Saves

Both are toggle endpoints — one URL, call to like, call again to unlike.

### `POST /api/events/:id/like/`

**Response `200`:**
```json
{
  "liked": true,
  "likes_count": 46,
  "message": "Event liked"
}
```

### `POST /api/events/:id/save/`

**Response `200`:**
```json
{
  "saved": true,
  "saves_count": 24,
  "message": "Event saved"
}
```

---

## 7. Notifications

> **New feature.** The current frontend shows three hardcoded fake notifications. This needs to be a real system. Notifications are the primary way users learn about event updates, reminders, and approvals.

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/notifications/` | Yes | Paginated notifications for current user |
| `POST` | `/api/notifications/:id/read/` | Yes | Mark one as read |
| `POST` | `/api/notifications/read-all/` | Yes | Mark all as read |
| `DELETE` | `/api/notifications/:id/` | Yes | Delete notification |
| `GET` | `/api/notifications/unread-count/` | Yes | Unread count (for navbar badge) |

### `GET /api/notifications/`

**Query params:** `?page=1`, `?is_read=false`

**Response `200`:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "type": "reminder",
      "title": "Event starts tomorrow",
      "body": "Shiloh 2024 is tomorrow. Don't miss it!",
      "detail": "You saved this event. It kicks off tomorrow at 9 AM at Faith Arena. Plan your travel now.",
      "event": {
        "id": 12,
        "title": "Shiloh 2024",
        "image": "https://..."
      },
      "is_read": false,
      "created_at": "2024-11-30T08:00:00Z"
    }
  ]
}
```

### `GET /api/notifications/unread-count/`

Called on every app load to populate the red badge on the navbar bell icon. Must be fast.

**Response `200`:**
```json
{ "count": 3 }
```

### `POST /api/notifications/read-all/`

**Response `200`:**
```json
{ "updated": 3 }
```

### Notification types and when they fire

| `type` | When it fires |
|--------|--------------|
| `reminder` | 24 hours before a saved or RSVPed event |
| `event_approved` | Admin approves an organizer's submitted event |
| `event_rejected` | Admin rejects a submitted event (include `rejection_reason`) |
| `new_event_nearby` | A new approved event matches the user's `preferred_categories` |
| `rsvp_confirmed` | User successfully RSVPs to an event |
| `event_cancelled` | Organizer deletes an approved event users have RSVPed to |

> `reminder` notifications require a background task scheduler (Celery + Redis or Django-Q). This does not need to be running in the first iteration — but the model and endpoints must be in place so the frontend reads real data immediately. Reminders can be triggered manually during development.

---

## 8. User Profile & Preferences

### `GET` / `PATCH /api/auth/user/`

The full user profile is used in multiple frontend pages (account page, settings, navbar, dashboard). It must always be returned in full — never partial.

### Complete User object

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Desmond",
  "last_name": "Egya",
  "username": "desmond_e",
  "phone_number": "+234 800 000 0000",
  "street_address": "12 Church Street",
  "city": "Lagos",
  "state": "Lagos State",
  "country": "Nigeria",
  "preferred_categories": ["worship", "music"],
  "preferred_languages": ["english", "yoruba"],
  "preferred_age_groups": ["young_adults"],
  "max_distance_km": 50,
  "email_notifications": true,
  "event_reminders": true,
  "date_joined": "2024-01-15T12:00:00Z",
  "events_created_count": 3,
  "events_liked_count": 12,
  "events_saved_count": 7,
  "events_attending_count": 4
}
```

**New fields:**
- `events_created_count`, `events_liked_count`, `events_saved_count`, `events_attending_count` — computed counts shown on the user's dashboard profile card.
- `preferred_categories` — array of category **slugs**. Used to personalise "new event nearby" notifications and to pre-select filters.

### Public organizer profile

`GET /api/users/:id/` — public profile of any user. Used on EventDetail to show who created the event.

**Response `200`:**
```json
{
  "id": 1,
  "first_name": "Desmond",
  "last_name": "Egya",
  "events_created_count": 12,
  "date_joined": "2024-01-15T12:00:00Z"
}
```

`GET /api/users/:id/events/` — paginated list of that user's approved events.

---

## 9. Data Models — Complete Field Reference

### Event

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | int | auto | |
| `title` | string | yes | Max 255 |
| `description` | text | yes | |
| `date` | datetime UTC | yes | Start time |
| `end_date` | datetime UTC | no | **New.** Must be after `date`. |
| `location` | string | yes | Human-readable address |
| `location_lat` | decimal(9,6) | no | **New.** For distance filtering |
| `location_lng` | decimal(9,6) | no | **New.** For distance filtering |
| `pricing` | enum | yes | `free` or `paid` |
| `ticket_price` | decimal(10,2) | if paid | **New.** Null when free |
| `category` | FK → Category | yes | Returns nested object in responses |
| `language` | enum | yes | See enumerations |
| `age_group` | enum | yes | See enumerations |
| `capacity` | int | no | **New.** Null = unlimited |
| `rsvp_count` | int | computed | **New.** |
| `is_rsvped` | bool | computed/user | **New.** False for guests |
| `image` | image | no | Full absolute URL in responses |
| `is_featured` | bool | admin | **New.** Default false |
| `approval_status` | enum | auto | `pending` on create |
| `rejection_reason` | text | no | **New.** Set by admin on reject |
| `created_by` | FK → User | auto | Returns `{ id, first_name, last_name }` |
| `is_liked` | bool | computed/user | False for guests |
| `is_saved` | bool | computed/user | False for guests |
| `likes_count` | int | computed | |
| `saves_count` | int | computed | |
| `created_at` | datetime | auto | |
| `updated_at` | datetime | auto | |

### Category

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | auto |
| `name` | string | Display name e.g. "Worship" |
| `slug` | string | Auto-generated. URL key e.g. "worship" |
| `icon` | string | Icon key. See Section 3. |
| `description` | text | Optional |
| `events_count` | int | Computed count of approved events |
| `is_active` | bool | Default true. Inactive = hidden from public |
| `sort_order` | int | Controls display order |

### Notification

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | auto |
| `user` | FK → User | Recipient |
| `type` | enum | See Section 7 |
| `title` | string | Short headline |
| `body` | string | One-line summary |
| `detail` | text | Full text shown on expand |
| `event` | FK → Event (nullable) | Related event if applicable |
| `is_read` | bool | Default false |
| `created_at` | datetime | auto |

### RSVP

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | auto |
| `event` | FK → Event | |
| `user` | FK → User | |
| `created_at` | datetime | auto |
| unique_together | | `(event, user)` |

---

## 10. Enumerations

These are the exact values the backend enforces and the frontend uses. Both sides must agree on these strings.

### `pricing`
| Value | Display |
|-------|---------|
| `free` | Free |
| `paid` | Paid |

### `language`
| Value | Display |
|-------|---------|
| `english` | English |
| `yoruba` | Yoruba |
| `igbo` | Igbo |
| `hausa` | Hausa |
| `pidgin` | Pidgin |
| `french` | French |
| `multilingual` | Multilingual |

### `age_group`
| Value | Display |
|-------|---------|
| `all_ages` | All Ages |
| `children` | Children (0–12) |
| `teenagers` | Teenagers (13–19) |
| `young_adults` | Young Adults (20–35) |
| `adults` | Adults (36–60) |
| `seniors` | Seniors (60+) |

### `approval_status`
| Value | Meaning |
|-------|---------|
| `pending` | Awaiting admin review |
| `approved` | Live on the platform |
| `rejected` | Rejected by admin |

### `notification_type`
| Value | Trigger |
|-------|---------|
| `reminder` | 24h before a saved/RSVPed event |
| `event_approved` | Admin approves event |
| `event_rejected` | Admin rejects event |
| `new_event_nearby` | New event in user's preferred categories |
| `rsvp_confirmed` | User RSVPs |
| `event_cancelled` | Organizer deletes approved event |

---

## 11. Error Response Format

Every error must be JSON. Never HTML. Two shapes:

**Field validation error (`400` / `422`):**
```json
{
  "title": ["This field is required."],
  "date": ["Enter a valid date/time."],
  "ticket_price": ["This field is required when pricing is paid."]
}
```

**General error (`400`, `401`, `403`, `404`, `500`):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

The frontend checks `error.message`. Do not return inconsistently shaped responses.

---

## 12. Pagination

All list endpoints that can grow large use `PageNumberPagination`.

**Settings:**
```python
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}
```

**Response shape:**
```json
{
  "count": 143,
  "next": "http://localhost:8000/api/events/?page=2",
  "previous": null,
  "results": []
}
```

**Endpoints that return flat arrays (no pagination):**
- `GET /api/categories/`
- `GET /api/events/liked/`
- `GET /api/events/saved/`
- `GET /api/events/my-events/`
- `GET /api/events/attending/`

---

## 13. Image Uploads

Events support an optional cover image submitted as `multipart/form-data`.

- Accept `image/jpeg`, `image/png`, `image/webp`
- Max file size: **10 MB** — enforce on the backend, not just the frontend
- Resize to max `1200px` width on upload (use `Pillow`)
- Store in `MEDIA_ROOT` or an object storage bucket (AWS S3, Cloudflare R2)
- The `image` field in every Event response must be a **full absolute URL** e.g. `https://yourdomain.com/media/events/abc.jpg`. Never a relative path — the frontend uses it directly in `<Image src={event.image} />`.

---

## 14. CORS & Security

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:3000",
    # add production URL when deploying
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
]
```

**Additional notes:**
- Token expiry: DRF tokens don't expire by default. Acceptable for now. Switch to `dj-rest-auth` with `knox` for expiring tokens before production.
- Rate limiting: add `DEFAULT_THROTTLE_CLASSES` to auth endpoints before going to production.
- `DEBUG = False` in production. Stack traces must never reach the client.
- Validate image file types on the backend — don't trust the browser's `accept` attribute.

---

## 15. New Features to Implement

These are features the frontend is ready to consume once the backend provides them.

### 15.1 Dynamic Categories ⭐ Critical

**Problem:** Categories are hardcoded in three frontend files. Any backend change breaks the UI silently.

**Build:**
- `Category` model with `name`, `slug`, `icon`, `events_count`, `is_active`, `sort_order`
- `GET /api/categories/` public endpoint
- Seed with initial categories (see Section 3)
- Admin panel CRUD

**Frontend impact:** CategoryFilter bar, AddEvent dropdown, and Settings preferences picker all call `GET /api/categories/` instead of hardcoded arrays. Ready to wire immediately after this endpoint ships.

---

### 15.2 RSVP System ⭐ Critical

**Problem:** The "Register / RSVP" button on EventDetail does nothing. This is the core conversion action.

**Build:** See Section 5.

**Frontend impact:** RSVP button becomes functional. EventCard and EventDetail show attendee count and full/available state.

---

### 15.3 Real Notifications ⭐ Critical

**Problem:** Notifications page shows hardcoded fake data. The navbar badge never changes.

**Build:** See Section 7. The notification model and CRUD endpoints must ship first; scheduled reminders (Celery) can follow.

**Frontend impact:** Notifications page reads real data. Navbar badge shows real unread count.

---

### 15.4 Event End Time

**Problem:** Events have a start time but no end time. Attendees need both.

**Build:** Add nullable `end_date` field to Event. Validate `end_date > date`.

**Frontend impact:** AddEvent gets an "End time" field. EventDetail shows event duration.

---

### 15.5 Ticket Price for Paid Events

**Problem:** `pricing = "paid"` with no price shown is confusing and incomplete.

**Build:** Add `ticket_price` decimal field. Required when `pricing = "paid"`. Return in all Event responses.

**Frontend impact:** AddEvent shows a price input when "Paid" is selected. EventCard and EventDetail display the price with ₦ currency symbol.

---

### 15.6 Event Capacity & Full State

**Problem:** Organisers can't cap attendance. Attendees don't know if an event is full.

**Build:** Add `capacity` int field (nullable = unlimited). Add computed `is_full` boolean. Enforce in RSVP endpoint.

**Frontend impact:** RSVP button shows "Event Full" and is disabled when `is_full = true`. EventDetail shows remaining spots.

---

### 15.7 Featured Events

**Problem:** No way to give high-quality events more visibility on the homepage.

**Build:** Add `is_featured` boolean (admin-only, default false). Support `?is_featured=true` filter.

**Frontend impact:** Hero section or top of EventGrid shows featured events in a spotlight area.

---

### 15.8 Rejection Reason

**Problem:** When an admin rejects an event, the organizer has no idea why. Poor organizer experience.

**Build:** Add `rejection_reason` text field. Admin fills it on rejection. Include in `my-events` response.

**Frontend impact:** MyEvents page shows rejection reason under rejected events with a "Fix and resubmit" prompt.

---

### 15.9 Related Events

**Problem:** "Related Events" section on EventDetail is always empty. Major missed discovery opportunity.

**Build:** `GET /api/events/:id/related/` — up to 6 approved events in the same category, excluding current event, ordered by `date`.

**Frontend impact:** EventDetail sidebar shows real related events as compact cards.

---

### 15.10 Password Reset Email

**Problem:** "Forgot password?" doesn't exist in the UI yet. The backend endpoints exist but the email flow may not be wired.

**Build:** Ensure `POST /api/auth/password/reset/` sends an actual email (configure SMTP or a service like SendGrid). Ensure the `POST /api/auth/password/reset/confirm/` flow completes cleanly.

**Frontend impact:** Add "Forgot password?" link to the Login form.

---

## 16. Implementation Priority

| Priority | Feature | Unblocks on Frontend |
|----------|---------|---------------------|
| 🔴 1 | Dynamic categories endpoint | CategoryFilter, AddEvent form, Settings all use hardcoded values today |
| 🔴 2 | Real notifications + unread-count | Notifications page, navbar badge |
| 🔴 3 | RSVP endpoints | EventDetail CTA button, attendee count |
| 🟡 4 | Event end time field | AddEvent form, EventDetail |
| 🟡 5 | Ticket price field | AddEvent form, EventCard, EventDetail |
| 🟡 6 | Rejection reason field | MyEvents page for organizers |
| 🟡 7 | Related events endpoint | EventDetail sidebar |
| 🟢 8 | Event capacity + is_full | RSVP gating UX |
| 🟢 9 | Featured events | Homepage spotlight |
| 🟢 10 | Organizer public profile | EventDetail organizer card link |
| 🟢 11 | Password reset email | Login "Forgot password?" link |

---

## 17. Frontend ↔ Backend Contract Checklist

Use this to verify each integration when a feature ships.

### Auth
- [ ] `POST /api/auth/login/` returns `{ key, user }` — not just `{ key }`
- [ ] `POST /api/auth/register/` returns `{ key, user }`
- [ ] `PATCH /api/auth/user/` returns full updated User object
- [ ] Token sent as `Authorization: Token <key>`

### Categories
- [ ] `GET /api/categories/` returns array with `id`, `name`, `slug`, `icon`, `events_count`, `is_active`
- [ ] Only `is_active = true` categories returned to public
- [ ] `slug` is exactly what `GET /api/events/?category=<slug>` filters on

### Events
- [ ] `GET /api/events/` returns `{ count, next, previous, results }`
- [ ] Results include `is_liked`, `is_saved`, `is_rsvped` for authenticated users
- [ ] Results include `is_liked: false`, `is_saved: false`, `is_rsvped: false` for guests (not omitted)
- [ ] `category` in response is `{ id, name, slug, icon }` — not a plain string
- [ ] `created_by` in response is `{ id, first_name, last_name }` — not a plain int
- [ ] `image` is a full absolute URL
- [ ] `?search=` matches `title`, `description`, `location`
- [ ] `?category=worship` filters by slug
- [ ] `?ordering=-date` sorts newest-date first

### RSVP
- [ ] `POST /api/events/:id/rsvp/` returns `{ rsvped, rsvp_count, message }`
- [ ] Returns `400` when event is at capacity
- [ ] `GET /api/events/attending/` returns flat `Event[]`

### Notifications
- [ ] `GET /api/notifications/` returns paginated list with all required fields
- [ ] `GET /api/notifications/unread-count/` returns `{ count }`
- [ ] `POST /api/notifications/read-all/` returns `{ updated: N }`
- [ ] `DELETE /api/notifications/:id/` returns `204`

### Likes & Saves
- [ ] `POST /api/events/:id/like/` returns `{ liked, likes_count, message }`
- [ ] `POST /api/events/:id/save/` returns `{ saved, saves_count, message }`

### Images
- [ ] `multipart/form-data` accepted on `POST /api/events/`
- [ ] `image` field in response is an absolute URL
- [ ] Backend rejects images over 10 MB with a `400`

### Errors
- [ ] All errors return JSON — never HTML
- [ ] General errors: `{ "detail": "..." }`
- [ ] Validation errors: `{ "field_name": ["message"] }`
- [ ] `404` returns `{ "detail": "Not found." }`
