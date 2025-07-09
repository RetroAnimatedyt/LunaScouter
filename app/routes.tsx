import React from "react";
import type { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ScoutingPage from "./components/scouting";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ScoutingPage />
      },
    ],
  },
];

export default routes;
