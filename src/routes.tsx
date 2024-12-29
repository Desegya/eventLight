import { createBrowserRouter } from "react-router-dom";

import EventDetail from "./components/EventDetail";
import Welcome from "./components/Welcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/event/:id",
    element: <EventDetail />,
  },
]);

export default router;
