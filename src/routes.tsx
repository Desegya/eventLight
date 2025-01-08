import { createBrowserRouter } from "react-router-dom";

import EventDetail from "./components/EventDetail";
import Welcome from "./components/Welcome";
import AddEvent from "./components/AddEvent";
import PreviewEvent from "./components/PreviewEvent";
import Account from "./components/Account";
import UserDashboard from "./components/UserDashboard";

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
    path: '/events/preview-event',
    element: <PreviewEvent />,
  },
  {
    path: '/account',
    element: <Account />,
  },
  {
    path: '/acc',
    element: <UserDashboard />,
  },
]);

export default router;
