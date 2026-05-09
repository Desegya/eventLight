# EventLight Backend Requirements

This document describes the backend contract required by the current EventLight frontend. It is based on the API calls, TypeScript types, forms, hooks, and components already wired in the React app.

The frontend expects a backend API at:

```text
http://localhost:8000/api
```

The backend is assumed to be Django/Django REST Framework, but any backend can work if it matches this contract.

## Core Requirements

The backend needs to support:

- User registration, login, logout, and token authentication
- Current user profile retrieval and update
- Password change and password reset endpoints
- Event list, detail, create, update, and delete
- Event image upload
- Event like/unlike toggling
- Event save/unsave toggling
- User-specific liked, saved, and created event lists
- CORS access from the Vite frontend

## Authentication

The frontend stores the auth token in `localStorage` as `authToken`.

All authenticated requests send:

```http
Authorization: Token <token>
```

Use DRF `TokenAuthentication` if building with Django REST Framework.

## User Shape

The frontend expects the current user response to contain:

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

## Auth Endpoints

### Register

```http
POST /api/auth/register/
```

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
{
  "key": "token_string"
}
```

The response may also include `user`, but the frontend immediately calls `GET /api/auth/user/` after registration.

### Login

```http
POST /api/auth/login/
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "key": "token_string"
}
```

The response may also include `user`, but the frontend immediately calls `GET /api/auth/user/` after login.

### Logout

```http
POST /api/auth/logout/
```

Requires authentication.

Return JSON, not an empty 204 response, because the frontend request helper calls `response.json()`.

Response:

```json
{
  "detail": "Logged out successfully."
}
```

### Current User

```http
GET /api/auth/user/
```

Requires authentication.

Response: full user object.

### Update Current User

```http
PATCH /api/auth/user/
```

Requires authentication.

Request may contain any subset of:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "08012345678",
  "street_address": "123 Example Street",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "preferred_categories": ["worship", "music"],
  "preferred_languages": ["english", "yoruba"],
  "preferred_age_groups": ["young_adults"],
  "max_distance_km": 50,
  "email_notifications": true,
  "event_reminders": true
}
```

Response: full updated user object.

### Change Password

```http
POST /api/auth/password/change/
```

Requires authentication.

Request:

```json
{
  "old_password": "oldpass",
  "new_password1": "newpass123",
  "new_password2": "newpass123"
}
```

Response:

```json
{
  "detail": "Password changed successfully."
}
```

### Password Reset

```http
POST /api/auth/password/reset/
```

Request:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "detail": "Password reset email sent."
}
```

### Password Reset Confirm

```http
POST /api/auth/password/reset/confirm/
```

Request:

```json
{
  "uid": "uid",
  "token": "reset-token",
  "new_password1": "newpass123",
  "new_password2": "newpass123"
}
```

Response:

```json
{
  "detail": "Password reset complete."
}
```

## Event Shape

Every event returned to the frontend should match:

```json
{
  "id": 1,
  "title": "Sunday Worship Service",
  "description": "Join us for worship.",
  "date": "2026-06-01T10:00:00Z",
  "location": "Lagos Christian Center",
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

Required fields:

- `id`: number
- `title`: string
- `description`: string
- `date`: ISO datetime string
- `location`: string
- `pricing`: `free` or `paid`
- `category`: string
- `event_type`: string
- `language`: string
- `age_group`: string
- `created_by`: user ID number
- `approval_status`: `pending`, `approved`, or `rejected`
- `image`: URL string or `null`
- `created_at`: ISO datetime string

Useful user-specific fields:

- `is_liked`: boolean
- `is_saved`: boolean
- `likes_count`: number
- `saves_count`: number

## Event Value Options

The create event form currently sends these values.

Categories:

```text
worship
conference
seminar
fellowship
outreach
youth
children
prayer
music
teaching
```

Event types:

```text
church_service
bible_study
prayer_meeting
fellowship
conference
seminar
outreach
special_event
```

Languages:

```text
english
yoruba
igbo
hausa
pidgin
french
multilingual
```

Age groups:

```text
all_ages
children
teenagers
young_adults
adults
seniors
```

Pricing:

```text
free
paid
```

Settings also reference these extra preference values:

```text
bible_study
community_service
spanish
youth
```

For fastest frontend compatibility, either allow flexible strings or normalize the frontend options later.

## Event Endpoints

### List Events

```http
GET /api/events/
```

Public.

Return a plain JSON array. Do not return DRF paginated shape like `{ "results": [...] }` unless the frontend is changed.

Response:

```json
[
  {
    "id": 1,
    "title": "Sunday Worship Service",
    "description": "Join us.",
    "date": "2026-06-01T10:00:00Z",
    "location": "Lagos",
    "pricing": "free",
    "category": "worship",
    "event_type": "church_service",
    "language": "english",
    "age_group": "all_ages",
    "created_by": 1,
    "approval_status": "approved",
    "image": null,
    "created_at": "2026-05-09T12:00:00Z",
    "is_liked": false,
    "is_saved": false,
    "likes_count": 0,
    "saves_count": 0
  }
]
```

### Create Event

```http
POST /api/events/
```

Requires authentication.

The frontend sends JSON when no image is selected:

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

The frontend sends `multipart/form-data` when an image is selected:

```text
title=Sunday Worship
description=Join us.
date=2026-06-01T10:00:00Z
location=Lagos
pricing=free
category=worship
event_type=church_service
language=english
age_group=all_ages
image=<file>
```

Backend should set:

- `created_by` from `request.user`
- `created_at` automatically
- `approval_status` to either `pending` or `approved`

Response: created event object.

### Get Event Detail

```http
GET /api/events/{id}/
```

Public.

Response: one event object.

### Update Event

```http
PUT /api/events/{id}/
```

Requires authentication.

Supports JSON and multipart data. The frontend uses `PUT` but may send partial data, so the backend should treat this like a partial update or use a serializer that allows partial updates for this route.

Response: updated event object.

### Delete Event

```http
DELETE /api/events/{id}/
```

Requires authentication.

Return JSON, not an empty 204 response.

Response:

```json
{
  "detail": "Event deleted successfully."
}
```

## Like And Save Endpoints

### Toggle Like

```http
POST /api/events/{id}/like/
```

Requires authentication.

If the current user has not liked the event:

```json
{
  "message": "Event liked successfully.",
  "liked": true
}
```

If the current user has already liked the event:

```json
{
  "message": "Event unliked successfully.",
  "liked": false
}
```

### Toggle Save

```http
POST /api/events/{id}/save/
```

Requires authentication.

If the current user has not saved the event:

```json
{
  "message": "Event saved successfully.",
  "saved": true
}
```

If the current user has already saved the event:

```json
{
  "message": "Event unsaved successfully.",
  "saved": false
}
```

### Liked Events

```http
GET /api/events/liked/
```

Requires authentication.

Response: plain array of event objects liked by the current user.

### Saved Events

```http
GET /api/events/saved/
```

Requires authentication.

Response: plain array of event objects saved by the current user.

### My Events

```http
GET /api/events/my-events/
```

Requires authentication.

Response: plain array of event objects where `created_by` is the current user.

## Error Responses

The frontend auth service reads `detail` first for errors.

Good generic error:

```json
{
  "detail": "Invalid credentials."
}
```

Good validation error:

```json
{
  "email": ["A user with this email already exists."],
  "password": ["This password is too short."]
}
```

Good unauthenticated error:

```json
{
  "detail": "Authentication credentials were not provided."
}
```

Use suitable HTTP status codes:

- `400` for validation errors
- `401` for missing/invalid auth
- `403` for authenticated but forbidden
- `404` for missing resources
- `500` only for unexpected server errors

## CORS And Development Settings

The frontend runs with Vite, usually at:

```text
http://localhost:5173
```

Backend CORS should allow:

- Origin: `http://localhost:5173`
- Methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- Headers: `Content-Type`, `Authorization`
- Multipart uploads

In development, serve media files so event images can render in the browser.

## Recommended Django Models

### User/Profile

Use either a custom user model or a user plus profile model. It must support email login and expose these fields:

- `email`
- `first_name`
- `last_name`
- `phone_number`
- `street_address`
- `city`
- `state`
- `country`
- `preferred_categories`
- `preferred_languages`
- `preferred_age_groups`
- `max_distance_km`
- `email_notifications`
- `event_reminders`

For array fields, use JSON fields for simple cross-database support.

### Event

Fields:

- `title`
- `description`
- `date`
- `location`
- `pricing`
- `category`
- `event_type`
- `language`
- `age_group`
- `created_by`
- `approval_status`
- `image`
- `created_at`
- `updated_at`

### EventLike

Fields:

- `user`
- `event`
- `created_at`

Constraint:

- unique `(user, event)`

### EventSave

Fields:

- `user`
- `event`
- `created_at`

Constraint:

- unique `(user, event)`

## Compatibility Notes

- The frontend expects `Authorization: Token <token>`, not Bearer auth.
- The frontend expects plain arrays for event list endpoints.
- The frontend calls `response.json()` for most requests, so avoid empty responses for delete/logout.
- Image URLs should be absolute or otherwise browser-resolvable.
- `created_by` is displayed as a user ID, so returning only the numeric ID is currently fine.
- Search UI exists but currently only logs the query. No search endpoint is required yet.
- Sidebar filters exist but do not call the backend yet. No filter endpoint is required yet.
- Notifications are mock frontend state only. No notification endpoint is wired yet.
- Related event routes are referenced in the UI but not backed by API calls yet.

## Suggested Build Order

1. Create Django project with DRF, CORS, token auth, and media settings.
2. Implement user model/profile fields and auth endpoints.
3. Implement event model and serializer matching the event shape above.
4. Implement public event list and detail endpoints.
5. Implement authenticated event create/update/delete with image upload.
6. Implement like/save toggle models and endpoints.
7. Implement liked, saved, and my-events list endpoints.
8. Implement password change/reset endpoints.
9. Add optional admin approval workflow, search, filters, notifications, and related events.

