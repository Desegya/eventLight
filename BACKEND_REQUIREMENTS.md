# EventLight — Backend API Contract

This document describes the complete API contract required by the EventLight frontend. Any backend that satisfies this spec will work; the reference implementation uses Django REST Framework.

The frontend expects the API at the URL set by `VITE_API_URL` (default: `http://localhost:8000/api`).

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Shape](#user-shape)
3. [Auth Endpoints](#auth-endpoints)
4. [Event Shape](#event-shape)
5. [Event Value Enumerations](#event-value-enumerations)
6. [Event Endpoints](#event-endpoints)
7. [Like & Save Endpoints](#like--save-endpoints)
8. [Error Responses](#error-responses)
9. [CORS & Development](#cors--development)
10. [Recommended Data Models](#recommended-data-models)
11. [Suggested Build Order](#suggested-build-order)
12. [Unimplemented Features](#unimplemented-features)

---

## Authentication

The frontend stores the auth token in `localStorage` under the key `authToken`.

Every authenticated request sends:

```
Authorization: Token <token>
```

Use DRF `TokenAuthentication` if building with Django REST Framework.

---

## User Shape

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "",
  "street_address": "",
  "city": "",
  "state": "",
  "country": "Nigeria",
  "preferred_categories": [],
  "preferred_languages": [],
  "preferred_age_groups": [],
  "max_distance_km": null,
  "email_notifications": true,
  "event_reminders": true
}
```

---

## Auth Endpoints

### `POST /api/auth/register/`

**Public.**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe"
}
```

Response:
```json
{ "key": "token_string" }
```

The frontend immediately calls `GET /api/auth/user/` after receiving the token.

---

### `POST /api/auth/login/`

**Public.**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{ "key": "token_string" }
```

The frontend immediately calls `GET /api/auth/user/` after receiving the token.

---

### `POST /api/auth/logout/`

**Requires authentication.**

Return JSON (not an empty 204) because the frontend calls `response.json()`:

```json
{ "detail": "Logged out successfully." }
```

---

### `GET /api/auth/user/`

**Requires authentication.**

Response: full user object (see [User Shape](#user-shape)).

---

### `PATCH /api/auth/user/`

**Requires authentication.**

Request: any subset of the user fields:
```json
{
  "first_name": "Jane",
  "phone_number": "08012345678",
  "city": "Lagos",
  "preferred_categories": ["music", "worship"],
  "preferred_languages": ["english"],
  "preferred_age_groups": ["young_adults"],
  "max_distance_km": 50,
  "email_notifications": true,
  "event_reminders": false
}
```

Response: updated full user object.

---

### `POST /api/auth/password/change/`

**Requires authentication.**

```json
{
  "old_password": "current",
  "new_password1": "newpass123",
  "new_password2": "newpass123"
}
```

Response:
```json
{ "detail": "Password changed successfully." }
```

---

### `POST /api/auth/password/reset/`

**Public.**

```json
{ "email": "user@example.com" }
```

Response:
```json
{ "detail": "Password reset email sent." }
```

---

### `POST /api/auth/password/reset/confirm/`

**Public.**

```json
{
  "uid": "uid_from_email",
  "token": "reset-token-from-email",
  "new_password1": "newpass123",
  "new_password2": "newpass123"
}
```

Response:
```json
{ "detail": "Password reset complete." }
```

---

## Event Shape

Every event object returned to the frontend must match this shape:

```json
{
  "id": 1,
  "title": "Sunday Worship Service",
  "description": "Join us for an evening of worship.",
  "date": "2026-06-01T10:00:00Z",
  "location": "Lagos Christian Center, Lagos",
  "pricing": "free",
  "category": "worship",
  "event_type": "church_service",
  "language": "english",
  "age_group": "all_ages",
  "created_by": 1,
  "approval_status": "approved",
  "image": "http://localhost:8000/media/events/image.jpg",
  "created_at": "2026-05-09T12:00:00Z",
  "is_liked": false,
  "is_saved": false,
  "likes_count": 0,
  "saves_count": 0
}
```

**Required fields:** `id`, `title`, `description`, `date`, `location`, `pricing`, `category`, `event_type`, `language`, `age_group`, `created_by`, `approval_status`, `image` (URL or `null`), `created_at`

**User-context fields** (return defaults when unauthenticated): `is_liked`, `is_saved`, `likes_count`, `saves_count`

---

## Event Value Enumerations

These are the exact string values the frontend currently sends and displays.

### `category`
```
worship  conference  seminar  fellowship  outreach
youth  children  prayer  music  teaching
```

### `event_type`
```
church_service  bible_study  prayer_meeting  fellowship
conference  seminar  outreach  special_event
```

### `language`
```
english  yoruba  igbo  hausa  pidgin  french  multilingual
```

### `age_group`
```
all_ages  children  teenagers  young_adults  adults  seniors
```

### `pricing`
```
free  paid
```

### `approval_status`
```
pending  approved  rejected
```

> **Tip:** Accept flexible strings on the backend to make initial development faster; enforce the enum once the frontend options are finalised.

---

## Event Endpoints

### `GET /api/events/`

**Public.** Return a **plain JSON array** — not a DRF paginated object (`{ "results": [...] }`).

The frontend paginates client-side. A future iteration will move pagination server-side.

Response:
```json
[
  { ...event },
  { ...event }
]
```

---

### `POST /api/events/`

**Requires authentication.**

When no image is selected, the frontend sends `application/json`:
```json
{
  "title": "Sunday Worship",
  "description": "Join us.",
  "date": "2026-06-01T10:00:00Z",
  "location": "Lagos",
  "pricing": "free",
  "category": "worship",
  "event_type": "church_service",
  "language": "english",
  "age_group": "all_ages"
}
```

When an image is selected, the frontend sends `multipart/form-data` with the same fields plus `image=<file>`.

The backend must:
- Set `created_by` from `request.user`
- Set `created_at` automatically
- Set `approval_status` to `pending` or `approved` per your workflow

Response: created event object.

---

### `GET /api/events/{id}/`

**Public.** Response: one event object.

---

### `PUT /api/events/{id}/`

**Requires authentication.** Treat as partial update (the frontend may send only changed fields). Supports both JSON and multipart/form-data.

Response: updated event object.

---

### `DELETE /api/events/{id}/`

**Requires authentication.** Return JSON (not empty 204):

```json
{ "detail": "Event deleted successfully." }
```

---

## Like & Save Endpoints

### `POST /api/events/{id}/like/`

**Requires authentication.** Toggle — like if not liked, unlike if already liked.

When liked:
```json
{ "message": "Event liked successfully.", "liked": true }
```

When unliked:
```json
{ "message": "Event unliked successfully.", "liked": false }
```

---

### `POST /api/events/{id}/save/`

**Requires authentication.** Toggle — save if not saved, unsave if already saved.

When saved:
```json
{ "message": "Event saved successfully.", "saved": true }
```

When unsaved:
```json
{ "message": "Event unsaved successfully.", "saved": false }
```

---

### `GET /api/events/liked/`

**Requires authentication.** Plain array of event objects liked by the current user.

---

### `GET /api/events/saved/`

**Requires authentication.** Plain array of event objects saved by the current user.

---

### `GET /api/events/my-events/`

**Requires authentication.** Plain array of event objects where `created_by` is the current user.

---

## Error Responses

The frontend reads `detail` first for generic errors, then checks for field-level keys.

Generic error:
```json
{ "detail": "Invalid credentials." }
```

Validation error:
```json
{
  "email": ["A user with this email already exists."],
  "password": ["This password is too short."]
}
```

Unauthenticated:
```json
{ "detail": "Authentication credentials were not provided." }
```

Use appropriate HTTP status codes:

| Status | Meaning                              |
|--------|--------------------------------------|
| `400`  | Validation error                     |
| `401`  | Missing or invalid auth token        |
| `403`  | Authenticated but not authorised     |
| `404`  | Resource not found                   |
| `500`  | Unexpected server error only         |

---

## CORS & Development

The Vite dev server runs at `http://localhost:5173`.

Required CORS configuration:
- **Origin:** `http://localhost:5173`
- **Methods:** `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- **Headers:** `Content-Type, Authorization`
- Multipart file uploads must be accepted

Serve `MEDIA_ROOT` in development so event images can load in the browser.

---

## Recommended Data Models

### CustomUser / Profile

Either a custom `AbstractBaseUser` with email login, or a `User` plus a `Profile` model. Must expose all fields in the [User Shape](#user-shape). Use JSON fields for array preferences (`preferred_categories`, etc.) for simplicity.

### Event

| Field             | Type           | Notes                              |
|-------------------|----------------|------------------------------------|
| `title`           | CharField      |                                    |
| `description`     | TextField      |                                    |
| `date`            | DateTimeField  | ISO 8601, UTC                      |
| `location`        | CharField      |                                    |
| `pricing`         | CharField      | `free` or `paid`                   |
| `category`        | CharField      | See enumerations                   |
| `event_type`      | CharField      | See enumerations                   |
| `language`        | CharField      | See enumerations                   |
| `age_group`       | CharField      | See enumerations                   |
| `created_by`      | FK → User      | Set from `request.user`            |
| `approval_status` | CharField      | `pending` / `approved` / `rejected`|
| `image`           | ImageField     | Nullable; serve from MEDIA_URL     |
| `created_at`      | DateTimeField  | Auto-set                           |
| `updated_at`      | DateTimeField  | Auto-set                           |

### EventLike

| Field      | Type          | Notes              |
|------------|---------------|--------------------|
| `user`     | FK → User     |                    |
| `event`    | FK → Event    |                    |
| `created_at` | DateTimeField | Auto-set          |

**Constraint:** `unique_together = [('user', 'event')]`

### EventSave

Same structure as `EventLike`.

---

## Suggested Build Order

1. Django project setup — DRF, CORS (`django-cors-headers`), token auth, media settings
2. Custom user model with email login + all profile fields
3. Auth endpoints: register, login, logout, current user, update profile
4. Password change and reset endpoints
5. Event model + serializer matching the [Event Shape](#event-shape) exactly
6. Public event list and detail endpoints
7. Authenticated event create (JSON + multipart) and delete
8. Event update endpoint
9. EventLike and EventSave models + toggle endpoints
10. Liked, saved, and my-events list endpoints

Optional / later:
- Admin approval workflow
- Server-side search and filtering (query params on `/api/events/`)
- Server-side pagination
- Notification model + endpoints
- Related events endpoint (filter by category, exclude current)
- Organiser profiles

---

## Unimplemented Frontend Features

These UI elements exist in the frontend but do not yet call the backend:

| Feature              | Status                                      |
|----------------------|---------------------------------------------|
| Search bar           | Logs query to console; no search endpoint yet |
| Sidebar filters      | Local state only; no filter params sent      |
| Notifications        | Hardcoded mock data; no backend wiring       |
| Related events       | Empty array; awaiting category-filter endpoint |
| Event attendance     | Not yet implemented                          |

These do not require backend work yet; they will be wired up in a future iteration.
