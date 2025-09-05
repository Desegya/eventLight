import { createBrowserRouter } from "react-router-dom";

import EventDetail from "./components/EventDetail";
import Welcome from "./components/Welcome";
import AddEvent from "./components/AddEvent";
import PreviewEvent from "./components/PreviewEvent";
import Account from "./components/Account";
import UserDashboard from "./components/UserDashboard";
import LikedEvents from "./components/LikedEvents";
import SavedEvents from "./components/SavedEvents";
import MyEvents from "./components/MyEvents";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import ApiTest from "./components/ApiTest";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/events/:id",
    element: <EventDetail />,
  },
  {
    path: "/events/add-event",
    element: (
      <ProtectedRoute>
        <AddEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events/preview-event",
    element: (
      <ProtectedRoute>
        <PreviewEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    path: "/liked-events",
    element: (
      <ProtectedRoute>
        <LikedEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/saved-events",
    element: (
      <ProtectedRoute>
        <SavedEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-events",
    element: (
      <ProtectedRoute>
        <MyEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/api-test",
    element: <ApiTest />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "account", element: <Account /> },
      { path: "saved-events", element: <SavedEvents /> },
      { path: "liked-events", element: <LikedEvents /> },
      { path: "my-events", element: <MyEvents /> },
      { path: "notifications", element: <Notifications /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default router;
