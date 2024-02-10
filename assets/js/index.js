import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource-variable/noto-naskh-arabic";
import "@fontsource-variable/overpass";
import "@fontsource-variable/radio-canada";
import "../css/index.css";
import Main from "./framework/Main";
import Library from "./framework/Library";
import Toc from "./framework/Toc";
import Chapter from "./framework/Chapter";
import SearchResults from "./framework/SearchResults";
import { Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Library />,
      },
      {
        path: "s/:searchStr",
        element: <SearchResults />,
      },
      {
        path: "b/:bookId",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Toc />,
          },
          {
            path: "c/:chapterId",
            element: <Chapter />,
          },
        ],
      },
    ],
  },
  { basename: "/" },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
