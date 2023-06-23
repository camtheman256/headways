import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import NearMe from "./app/NearMe.tsx";
import About from "./app/About.tsx";
import Routes from "./app/Routes.tsx";
import Route from "./app/Route.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <NearMe />,
        id: "Home",
      },
      {
        path: "/routes",
        element: <Routes />,
      },
      {
        path: "/routes/:routeId",
        element: <Route />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
