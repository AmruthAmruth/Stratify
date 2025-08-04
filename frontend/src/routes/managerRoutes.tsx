import type { RouteObject } from "react-router-dom";

const managerRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Manager</h1>,
  },
  {
    path: "companies",
    element: <h1>Companies</h1>,
  },
];

export default managerRoutes;
