import type { RouteObject } from "react-router";

const adminRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Admin Dashboard</h1>
  },
  {
    path: "companies",
    element: <h1>Companies</h1>
  }
];

export default adminRoutes;
