import { createBrowserRouter } from "react-router-dom";

import EventDetail from "./components/EventDetail";
import Welcome from "./components/Welcome";
import AddEvent from "./components/AddEvent";
import PreviewEvent from "./components/PreviewEvent";

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
]);

export default router;
