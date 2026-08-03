# eventLight — Authentication Specification

**Stack:** Django REST Framework  
**Current scheme:** DRF Token (no expiry)  
**Target scheme:** Knox (expiring tokens)

---

## How auth works right now

The frontend stores the token in `localStorage` and attaches it to every request:

```http
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

On every page load, the app calls `GET /api/auth/user/` to validate the token and hydrate
the logged-in user. If that call fails, the token is cleared and the user is treated as
logged out.

---

## Known problems

**1. Tokens never expire.**  
Standard DRF tokens have no TTL. A leaked token is valid forever unless the user explicitly
logs out. There is no way to invalidate all sessions remotely.

**2. Token is in `localStorage`.**  
`localStorage` is readable by any JavaScript on the page. An XSS vulnerability anywhere in
the app gives an attacker the token directly. The safer alternative is an `httpOnly` cookie,
which JavaScript cannot read at all.

Both issues need to be fixed before this app goes to production.

---

## What needs to change on the backend

### Switch to Knox

Install [django-knox](https://github.com/jazzband/django-knox). It is a drop-in replacement
for DRF's `authtoken` that adds:

- Configurable token expiry
- Per-device token management (each login creates a separate token — logging out one device
  doesn't log out others)
- Secure token hashing (Knox only stores the hash, not the raw token)

```bash
pip install django-knox
```

```python
# settings.py

INSTALLED_APPS = [
    ...
    'knox',            # replaces 'rest_framework.authtoken'
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'knox.auth.TokenAuthentication',
    ],
}

from datetime import timedelta
KNOX_TOKEN_MODEL = 'knox.AuthToken'
REST_KNOX = {
    'TOKEN_TTL': timedelta(days=30),   # tokens expire after 30 days
    'AUTO_REFRESH': True,              # activity resets the expiry window
}
```

Run migrations after adding Knox:

```bash
python manage.py migrate
```

---

## Auth endpoints — full contract

The frontend talks to these endpoints. The response shape must match exactly.

### Register

```http
POST /api/auth/register/
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "Desmond",
  "last_name": "Egya",
  "username": "desmond_e"
}
```

**Response `201`:**

```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "expiry": "2026-06-11T12:00:00Z",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "desmond_e",
    "first_name": "Desmond",
    "last_name": "Egya",
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
    "event_reminders": true,
    "date_joined": "2026-05-12T08:00:00Z",
    "events_created_count": 0,
    "events_liked_count": 0,
    "events_saved_count": 0,
    "events_attending_count": 0
  }
}
```

**The `user` object is mandatory in this response.** The frontend sets user state directly
from it — no second `GET /api/auth/user/` call is made after register.

**Error responses:**

```json
{ "email": ["A user with this email already exists."] }
{ "password": ["This password is too short. It must contain at least 8 characters."] }
```

---

### Login

```http
POST /api/auth/login/
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:**

```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "expiry": "2026-06-11T12:00:00Z",
  "user": { "...": "full user object, same shape as register" }
}
```

Same rule: **`user` must be in the response.** The frontend reads user state directly from
the login response.

**Error response:**

```json
{ "detail": "Invalid credentials." }
```

---

### Logout

```http
POST /api/auth/logout/
Authorization: Token <token>
```

Invalidates the current token only (the device that made the request). No body needed.

**Response `200`:**

```json
{ "detail": "Logged out successfully." }
```

With Knox, this deletes the token record from the database. The same token cannot be reused.

---

### Current user

```http
GET  /api/auth/user/
PATCH /api/auth/user/
Authorization: Token <token>
```

`GET` — returns the full user object (same shape as the register/login response `user` field).

`PATCH` — accepts any subset of the following updatable fields and returns the full updated
user object:

```json
{
  "username": "desmond_e",
  "first_name": "Desmond",
  "last_name": "Egya",
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
  "event_reminders": true
}
```

`preferred_categories` takes an array of category **slugs** — not names or IDs.

**Error (username conflict):**

```json
{ "username": ["A user with this username already exists."] }
```

---

### Change password

```http
POST /api/auth/password/change/
Authorization: Token <token>
Content-Type: application/json
```

```json
{
  "old_password": "oldpassword123",
  "new_password1": "newpassword123",
  "new_password2": "newpassword123"
}
```

**Response `200`:**

```json
{ "detail": "Password changed successfully." }
```

**Error responses:**

```json
{ "old_password": ["Your old password was entered incorrectly."] }
{ "new_password2": ["The two password fields did not match."] }
{ "new_password1": ["This password is too short. It must contain at least 8 characters."] }
```

---

### Forgot password — Step 1 (request reset email)

```http
POST /api/auth/password/reset/
Content-Type: application/json
```

```json
{ "email": "user@example.com" }
```

**Response `200`** — always this, regardless of whether the email is registered:

```json
{ "detail": "If that email is registered, a reset link has been sent." }
```

The email must contain a link in this exact format:

```
http://localhost:5173/reset-password?token=<token>
```

Replace `localhost:5173` with `FRONTEND_URL` from environment config in production.

**Rules:**
- Token must expire after **1 hour**
- Token is **single-use** — submitting it twice returns the invalid/expired error
- Use a secure random string stored hashed in the database (do not use the Knox auth token
  for this — this is a separate one-time-use token)

**Error response:**

```json
{ "email": ["This field is required."] }
```

---

### Forgot password — Step 2 (confirm reset)

```http
POST /api/auth/password/reset/confirm/
Content-Type: application/json
```

```json
{
  "token": "<token from URL query string>",
  "new_password1": "newpassword123",
  "new_password2": "newpassword123"
}
```

**Response `200`:**

```json
{ "detail": "Password reset complete. You can now log in." }
```

No auth token is returned. The user is redirected to login and must sign in normally.

**Error responses:**

```json
{ "token": ["This reset link is invalid or has expired."] }
{ "new_password2": ["The two password fields did not match."] }
{ "new_password1": ["This password is too short. It must contain at least 8 characters."] }
{ "token": ["This field is required."] }
{ "new_password1": ["This field is required."] }
```

---

## The `key` field — important note

Knox's default serializer uses `token` as the key name in its response. The frontend reads
it as `key` (matching the original DRF convention). **You must alias `token` → `key` in
your serializer**, or update the frontend's `authService` to read `token` instead.

The simplest approach — override the Knox login serializer:

```python
from knox.views import LoginView as KnoxLoginView
from knox.models import AuthToken

class LoginView(KnoxLoginView):
    def get_post_response_data(self, request, token, instance):
        data = super().get_post_response_data(request, token, instance)
        data['key'] = data.pop('token')   # rename to match frontend expectation
        data['user'] = UserSerializer(request.user, context={'request': request}).data
        return data
```

Apply the same pattern to the register view.

---

## The full User object shape

Every endpoint that returns a user must use this exact shape. Partial responses will break
the frontend's user state.

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "desmond_e",
  "first_name": "Desmond",
  "last_name": "Egya",
  "phone_number": "+234 800 000 0000",
  "street_address": "12 Church Street",
  "city": "Lagos",
  "state": "Lagos State",
  "country": "Nigeria",
  "preferred_categories": ["worship", "music"],
  "preferred_languages": ["english"],
  "preferred_age_groups": ["young_adults"],
  "max_distance_km": 50,
  "email_notifications": true,
  "event_reminders": true,
  "date_joined": "2026-01-15T12:00:00Z",
  "events_created_count": 3,
  "events_liked_count": 12,
  "events_saved_count": 7,
  "events_attending_count": 4
}
```

The four `*_count` fields are computed — use `SerializerMethodField` or database annotations.
`date_joined` comes from Django's `AbstractUser`.

---

## Token handling on the frontend (for reference)

The frontend (`services/auth.ts`) stores the token in `localStorage` under the key
`authToken` and reads it on every API request:

```ts
localStorage.setItem("authToken", response.key)
// attached to every request as:
Authorization: Token <authToken>
```

On app load, if a token exists in storage, the app calls `GET /api/auth/user/`. If that
returns `401`, the token is cleared and the user is logged out.

**This means:** a Knox `401` response on any request (token expired, invalid, or deleted)
will correctly log the user out on the frontend — no extra work needed there.

---

## Rate limiting (before production)

Add throttling to the auth endpoints to prevent brute-force attacks:

```python
# views.py — apply to login view specifically
from rest_framework.throttling import AnonRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    rate = '10/hour'

class LoginView(KnoxLoginView):
    throttle_classes = [LoginRateThrottle]
```

Also add a global anon throttle in `settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {'anon': '100/hour'},
}
```

---

## Checklist

- [ ] Knox installed and `rest_framework.authtoken` replaced
- [ ] Token TTL set to 30 days, `AUTO_REFRESH = True`
- [ ] Login returns `{ key, expiry, user }` — `key` not `token`
- [ ] Register returns `{ key, expiry, user }` — same shape
- [ ] Full user object in both responses (all fields listed above)
- [ ] `PATCH /api/auth/user/` accepts `username` and returns full updated user
- [ ] Password reset token expires after 1 hour, single-use
- [ ] Password reset email sends `FRONTEND_URL/reset-password?token=<token>`
- [ ] Email backend configured (`console` for dev, real SMTP for production)
- [ ] Login rate limiting — 10 attempts per hour per IP
- [ ] `401` on expired/invalid token — frontend handles this correctly already
