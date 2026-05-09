# eventlight

A modern event discovery platform. Find concerts, conferences, workshops, festivals, and more — all in one place.

---

## Overview

eventlight connects people with events happening around them. Users can browse a curated feed of events, filter by category, date, location, and more, like and save events they're interested in, and create their own.

---

## Tech Stack

| Layer       | Technology                                 |
|-------------|---------------------------------------------|
| Framework   | React 18 + TypeScript                       |
| UI Library  | Chakra UI v2                                |
| Routing     | React Router v7                             |
| Build Tool  | Vite 6                                      |
| Styling     | Chakra theme system + Google Fonts          |
| Icons       | React Icons (Feather set)                   |
| Date Utils  | date-fns                                    |
| Animation   | Framer Motion                               |
| Backend API | Django REST Framework (see backend section) |
| Auth        | Token-based (DRF TokenAuthentication)       |

---

## Design System

- **Font:** Plus Jakarta Sans (Google Fonts)
- **Primary color:** Violet — `#7C3AED` (`brand.600`)
- **Accent color:** Amber — `#F59E0B` (`accent.500`)
- **Dark mode:** Supported, uses Chakra's `useColorMode` and system preference detection
- **Logo:** Custom SVG mark (4-pointed sparkle in a rounded violet badge)

---

## Project Structure

```
src/
├── assets/           # Static assets (logo SVG)
├── components/       # All UI components
│   ├── NavBar.tsx         # Sticky frosted-glass navigation
│   ├── HeroSection.tsx    # Landing hero with search + stats
│   ├── CategoryFilter.tsx # Horizontal sticky category pill bar
│   ├── Welcome.tsx        # Home page layout
│   ├── EventGrid.tsx      # Paginated event grid
│   ├── EventCard.tsx      # Individual event card
│   ├── SideBar.tsx        # Filter sidebar (desktop inline / mobile drawer)
│   ├── EventDetail.tsx    # Full event detail page
│   ├── AddEvent.tsx       # Event creation form
│   ├── PreviewEvent.tsx   # Event preview before submission
│   ├── Login.tsx          # Login screen
│   ├── Register.tsx       # Registration screen
│   ├── UserDashboard.tsx  # Authenticated user dashboard layout
│   ├── Account.tsx        # Profile management
│   ├── Settings.tsx       # App and notification preferences
│   ├── LikedEvents.tsx    # User's liked events
│   ├── SavedEvents.tsx    # User's saved events
│   ├── MyEvents.tsx       # User's created events (with delete)
│   ├── Notifications.tsx  # Notification centre
│   └── ProtectedRoute.tsx # Auth guard wrapper
├── contexts/
│   └── AuthContext.tsx    # Auth state, login/register/logout
├── hooks/
│   ├── useEvents.ts       # Fetch + CRUD for events
│   ├── useUserEvents.ts   # Liked / saved / my events hooks
│   └── useEventInteractions.ts  # Like / save toggles with loading states
├── services/
│   ├── api.ts             # ApiService class (all event endpoints)
│   └── auth.ts            # AuthService class (all auth endpoints)
├── types/
│   ├── event.ts           # Event, CreateEventData, UpdateEventData
│   └── auth.ts            # User, LoginCredentials, RegisterData, etc.
├── routes.tsx             # React Router route definitions
├── theme.ts               # Chakra UI custom theme
├── App.tsx                # Root component
└── main.tsx               # Entry point with providers
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running backend API (see [Backend Requirements](#backend-requirements))

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd eventlight

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL to your backend URL

# 4. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment Variables

| Variable       | Default                       | Description            |
|----------------|-------------------------------|------------------------|
| `VITE_API_URL` | `http://localhost:8000/api`   | Backend API base URL   |

---

## Features

### Browsing & Discovery
- **Hero search** — Full-width search bar on the landing page
- **Category filter bar** — Sticky horizontal pill tabs (All, Music, Tech, Sports, Workshops, …)
- **Event grid** — Responsive card grid with pagination
- **Sidebar filters** — Filter by category, date, location, pricing, event type, age group, language

### Event Cards
- Image-forward design with gradient overlays
- Category and pricing badges on the image
- Like and save buttons that appear on hover
- Smooth hover lift animation

### Event Detail
- Full event information page
- Live countdown timer to the event
- Like, save, and share actions
- Google Maps link for location

### Authentication
- Email + password registration and login
- Token stored in `localStorage` as `authToken`
- Protected routes redirect to login
- Profile update and password change

### User Dashboard
- **Account** — Edit personal details and address
- **My Events** — View, manage, and delete events you've created
- **Liked Events** — Events you've liked
- **Saved Events** — Events you've bookmarked
- **Notifications** — Notification centre
- **Settings** — Notification and event preferences

### Create Event
- Rich event creation form (title, date, location, category, pricing, image upload)
- Preview step before submission

---

## Backend Requirements

The frontend talks to a REST API at `VITE_API_URL`. See [`BACKEND_REQUIREMENTS.md`](./BACKEND_REQUIREMENTS.md) for the full API contract.

Quick summary:
- Auth: `POST /api/auth/register/`, `POST /api/auth/login/`, `GET /api/auth/user/`
- Events: `GET /api/events/`, `POST /api/events/`, `GET /api/events/:id/`, `PUT /api/events/:id/`, `DELETE /api/events/:id/`
- Interactions: `POST /api/events/:id/like/`, `POST /api/events/:id/save/`
- User lists: `GET /api/events/liked/`, `GET /api/events/saved/`, `GET /api/events/my-events/`

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build (tsc + vite build)
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

---

## Roadmap

- [ ] Connect search bar to backend search endpoint
- [ ] Connect sidebar filters to backend filter params
- [ ] Related events on event detail page
- [ ] Real-time notifications
- [ ] Event attendance / RSVP
- [ ] Organiser profile pages
- [ ] Map view for events
- [ ] PWA / mobile app
