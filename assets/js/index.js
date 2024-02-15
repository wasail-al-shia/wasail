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
import ViewReport from "./framework/ViewReport";
import WsReport from "./framework/WsReport";
import SearchResults from "./framework/SearchResults";

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
        path: "b/:bookId",
        element: <Toc />,
      },
      {
        path: "c/:chapterId",
        element: <Chapter />,
      },
      {
        path: "r/:reportId",
        element: <ViewReport />,
      },
      {
        path: "h/:reportNo",
        element: <WsReport />,
      },
      {
        path: "q/:queryStr",
        element: <SearchResults />,
      },
    ],
  },
  { basename: "/" },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
