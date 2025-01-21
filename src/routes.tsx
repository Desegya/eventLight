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
    element: <AddEvent />,
  },
  {
    path: "/events/preview-event",
    element: <PreviewEvent />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/liked-events",
    element: <LikedEvents />,
  },
  {
    path: "/saved-events",
    element: <SavedEvents />,
  },
  {
    path: "/liked-events",
    element: <LikedEvents />,
  },
  {
    path: "/my-events",
    element: <MyEvents />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/acc",
    element: <UserDashboard />,
  },
  {path: "/dashboard",
    element: <UserDashboard />, // Dashboard layout
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
