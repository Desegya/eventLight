# eventLight — Authentication Specification

**Stack:** Django (plain views, not DRF viewsets) + django-rest-knox
**Scheme:** Knox expiring token, delivered to the browser as an **httpOnly cookie**, with CSRF protection on all mutating requests.

---

## How auth works right now

Login/register create a Knox token server-side and set it as an `httpOnly`, `Secure` (in
production), `SameSite`-scoped cookie named `auth_token`. The browser attaches this cookie
automatically on every request to the API (`credentials: "include"` on `fetch`) — page
JavaScript never sees the raw token, so an XSS bug can no longer just read it out of
`localStorage`.

Because the auth cookie is sent automatically by the browser, every mutating endpoint
(anything other than GET/HEAD/OPTIONS) is protected by Django's CSRF middleware. The frontend
calls `GET /api/auth/csrf/` once per session to receive a `csrftoken` cookie (this one is
**not** httpOnly — it has to be readable by JS), then echoes its value back as an
`X-CSRFToken` header on every POST/PATCH/PUT/DELETE. See [`src/services/csrf.ts`](src/services/csrf.ts)
for the bootstrap/header logic — `api.ts` and `auth.ts` both call `ensureCsrfCookie()` before
every request.

On every page load, `AuthContext` calls `GET /api/auth/user/` to hydrate the logged-in user.
Since there's no local flag to check first (no token in storage), it just makes the call —
if the cookie is missing/expired, the backend returns `401` and the app treats that as
logged out.

The `Authorization: Token <token>` header still works server-side (`CookieTokenAuthentication`
tries the header first, then falls back to the cookie) — useful for the test suite or any
future non-browser client — but the web app itself relies on the cookie exclusively.

---

## Cross-origin deployment — read this before deploying

The frontend and backend are deployed to **different domains** (e.g. a Vercel domain for the
frontend, a Railway/Render domain for the backend). From the browser's perspective, every API
call is cross-site. That has two consequences:

1. **Cookies need `SameSite=None; Secure`** in production (both the auth cookie and Django's
   CSRF cookie). The backend sets this automatically based on `DEBUG`:
   `SameSite=Lax` locally (frontend/backend are same-site on `localhost`, different ports),
   `SameSite=None; Secure` when `DEBUG=False` (requires HTTPS on both sides — true for
   Vercel/Railway/Render by default).

2. **`CSRF_TRUSTED_ORIGINS` and `CORS_ALLOWED_ORIGINS` must both be set to the real frontend
   origin in production** (e.g. `https://eventlight.vercel.app`). Django validates the
   `Origin` header on every unsafe request against `CSRF_TRUSTED_ORIGINS` — this check runs
   regardless of scheme, so even local dev needs `http://localhost:5173` in that list (already
   the default in `.env.example`). If you deploy and forget to set these, every POST/PATCH/
   DELETE from the frontend will fail with `403 CSRF verification failed. Origin checking
   failed.` — this is the single most common way this setup breaks after a fresh deploy.

---

## Auth endpoints — full contract

The frontend talks to these endpoints. The response shape must match exactly.

### CSRF bootstrap

```http
GET /api/auth/csrf/
```

Sets the `csrftoken` cookie. Call this once on app load, before any mutating request.

**Response `200`:**

```json
{ "detail": "CSRF cookie set." }
```

---

### Register

```http
POST /api/auth/register/
Content-Type: application/json
X-CSRFToken: <csrftoken cookie value>
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

**Response `201`** — sets the `auth_token` cookie via `Set-Cookie`, body contains only the user:

```json
{
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
from it — no second `GET /api/auth/user/` call is made after register. There is **no `key`
field** — the token is only ever delivered via the `Set-Cookie` header, never in the body.

**Error responses:**

```json
{ "email": ["A user with this email already exists."] }
{ "password": ["This password is too short. It must contain at least 8 characters."] }
```

Rate limited to 10 requests/minute per IP.

---

### Login

```http
POST /api/auth/login/
Content-Type: application/json
X-CSRFToken: <csrftoken cookie value>
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`** — sets the `auth_token` cookie, same body shape as register:

```json
{
  "user": { "...": "full user object, same shape as register" }
}
```

**Error response:**

```json
{ "detail": "Invalid credentials." }
```

Rate limited to 10 requests/minute per IP.

---

### Logout

```http
POST /api/auth/logout/
X-CSRFToken: <csrftoken cookie value>
```

Invalidates the current token (deletes the Knox token record) and clears the `auth_token`
cookie via `Set-Cookie` with an expired date. No body needed — the auth cookie is sent
automatically by the browser.

**Response `200`:**

```json
{ "detail": "Logged out successfully." }
```

---

### Current user

```http
GET  /api/auth/user/
PATCH /api/auth/user/
```

(`PATCH` needs `X-CSRFToken`; `GET` doesn't.) Both are authenticated via the `auth_token`
cookie automatically.

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
Content-Type: application/json
X-CSRFToken: <csrftoken cookie value>
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
X-CSRFToken: <csrftoken cookie value>
```

```json
{ "email": "user@example.com" }
```

**Response `200`** — always this, regardless of whether the email is registered:

```json
{ "detail": "If that email is registered, a reset link has been sent." }
```

The email contains a link in this exact format:

```
http://localhost:5173/reset-password?token=<token>
```

`localhost:5173` is replaced with `FRONTEND_URL` from environment config in production —
**this must be set to the real deployed frontend URL or reset emails will link to localhost.**

**Rules:**
- Token expires after **1 hour** (`PASSWORD_RESET_TIMEOUT_SECONDS`)
- Token is **single-use** — submitting it twice returns the invalid/expired error
- Uses a separate `secrets.token_urlsafe(32)` value stored in `PasswordResetToken`, not the
  Knox auth token

Rate limited to 5 requests/minute per IP.

**Error response:**

```json
{ "email": ["This field is required."] }
```

---

### Forgot password — Step 2 (confirm reset)

```http
POST /api/auth/password/reset/confirm/
Content-Type: application/json
X-CSRFToken: <csrftoken cookie value>
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

No auth cookie is set. The user is redirected to login and must sign in normally.

**Error responses:**

```json
{ "token": ["This reset link is invalid or has expired."] }
{ "new_password2": ["The two password fields did not match."] }
{ "new_password1": ["This password is too short. It must contain at least 8 characters."] }
{ "token": ["This field is required."] }
{ "new_password1": ["This field is required."] }
```

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

## Backend implementation notes

- `api/authentication.py` — `CookieTokenAuthentication` subclasses Knox's `TokenAuthentication`,
  tries the `Authorization` header first, falls back to the `auth_token` cookie.
- `api/views.py` — `set_auth_cookie()` / `clear_auth_cookie()` helpers wrap `response.set_cookie()`
  / `response.delete_cookie()`; called from `register`, `login`, `logout`.
- `config/settings.py` — `AUTH_COOKIE_NAME`, `AUTH_COOKIE_SAMESITE`, `AUTH_COOKIE_SECURE`,
  `CSRF_COOKIE_SAMESITE` control cookie flags; all DEBUG-aware (see the cross-origin section
  above).
- Token TTL: 30 days, sliding (`REST_KNOX = {'TOKEN_TTL': timedelta(days=30), 'AUTO_REFRESH': True}`).
- `api/tests.py` — `CookieAuthCsrfTests` uses `Client(enforce_csrf_checks=True)` (the default
  test client silently skips CSRF checks) to verify: registering without a CSRF token is
  rejected, the auth cookie is `httponly`, a cookie-only request authenticates correctly, and
  logout actually clears the cookie.

## Rate limiting

Implemented via `django-ratelimit` (`api/views.py`):
- `register`, `login`: 10/minute per IP
- `password_reset`, `password_reset_confirm`: 5/minute, 10/minute per IP

A rate-limited request gets a JSON `429` (`api.views.api_permission_denied` — registered as
`handler403`, since `django_ratelimit.exceptions.Ratelimited` is a `PermissionDenied`
subclass).

---

## Checklist

- [x] Knox installed, tokens expire after 30 days, `AUTO_REFRESH = True`
- [x] Token delivered via httpOnly cookie, not `localStorage` or response body
- [x] CSRF protection on all mutating endpoints, bootstrapped via `GET /api/auth/csrf/`
- [x] Login/register return `{ user }` — full user object, no `key`
- [x] `PATCH /api/auth/user/` accepts `username` and returns full updated user
- [x] Password reset token expires after 1 hour, single-use
- [x] Password reset email sends `FRONTEND_URL/reset-password?token=<token>`
- [x] Login/register/password-reset rate limiting
- [x] `401` on missing/expired/invalid auth cookie — frontend handles this correctly
- [ ] `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` set to the real deployed
      frontend URL in production (deployer's responsibility — see cross-origin section above)
