# EventLight API Integration

## Overview

Successfully integrated the React frontend with the Django backend API running on localhost:8000.

## What Was Implemented

### 1. Type Definitions (`src/types/event.ts`)

- `Event` interface matching the API response structure
- `CreateEventData` interface for creating new events
- `UpdateEventData` interface for updating existing events

### 2. API Service (`src/services/api.ts`)

- Complete API service class with methods for all CRUD operations
- Proper error handling with custom `ApiError` class
- Support for both JSON and FormData requests (for image uploads)
- Authentication token support via localStorage

### 3. Custom Hooks (`src/hooks/useEvents.ts`)

- `useEvents()` hook for managing events list with loading/error states
- `useEvent(id)` hook for fetching single event details
- Built-in CRUD operations: create, update, delete events

### 4. Updated Components

#### EventGrid (`src/components/EventGrid.tsx`)

- ✅ Now fetches events from API instead of static JSON
- ✅ Loading spinner and error handling
- ✅ Proper mapping of API response to component props
- ✅ Pagination still works with API data

#### EventDetail (`src/components/EventDetail.tsx`)

- ✅ Uses API to fetch single event details
- ✅ Proper date formatting with date-fns
- ✅ Error handling for missing events
- ✅ Updated to use new property names from API

#### AddEvent (`src/components/AddEvent.tsx`)

- ✅ Complete rewrite to use API endpoints
- ✅ Form validation and submission
- ✅ Image upload support
- ✅ Toast notifications for success/error
- ✅ Loading states during submission

### 5. API Test Component (`src/components/ApiTest.tsx`)

- Simple component to test API connectivity
- Available at `/api-test` route
- Shows connection status and sample events

## API Integration Details

### Event Structure Mapping

**Old JSON Structure → New API Structure:**

- `eventid` → `id`
- `eventName` → `title`
- `eventDate` → `date` (ISO format)
- `eventLocation` → `location`
- `eventDescription` → `description`
- `eventPricing` → `pricing` ("free" | "paid")
- `eventImage` → `image` (URL or null)
- `eventCategory` → Not in API (using "General" as default)
- `eventOrganizer` → `created_by` (user ID)

### Available API Endpoints

1. **GET /api/events/** - List all events
2. **POST /api/events/** - Create new event (requires auth)
3. **GET /api/events/{id}/** - Get event details
4. **PUT /api/events/{id}/** - Update event (requires auth)
5. **DELETE /api/events/{id}/** - Delete event (requires auth)

### Authentication

- Uses Bearer token authentication
- Token stored in localStorage as 'authToken'
- Automatically included in requests when available

## Key Features

### ✅ Implemented

- Complete API integration
- Loading states and error handling
- Event creation with image upload
- Event listing with pagination
- Event detail viewing
- Proper TypeScript types
- Toast notifications
- CORS support

### 🔄 Notes for Backend

Make sure your Django backend has:

1. **CORS enabled** for localhost:5173 (or your dev port)
2. **Media file serving** configured for event images
3. **Authentication endpoints** for login/signup

### 🚀 Testing

1. Start your Django backend on localhost:8000
2. Start the React frontend
3. Visit `/api-test` to verify connection
4. Try creating a new event at `/events/add-event`
5. View events on the homepage

## Error Handling

- Network errors are caught and displayed to users
- Loading states prevent duplicate submissions
- Failed requests show appropriate error messages
- API errors include status codes for debugging

## Next Steps

1. Implement authentication (login/signup)
2. Add event filtering/search functionality
3. Implement user profiles and event ownership
4. Add event categories and organizer management
5. Implement real-time notifications
