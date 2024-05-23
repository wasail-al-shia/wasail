import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource-variable/noto-naskh-arabic";
import "@fontsource-variable/overpass";
import "@fontsource-variable/radio-canada";
import "../css/index.css";
import Main from "./framework/Main";
import Library from "./framework/Library";
import SectionList from "./framework/SectionList";
import ChapterList from "./framework/ChapterList";
import ReportList from "./framework/ReportList";
import ViewReport from "./framework/ViewReport";
import WsReport from "./framework/WsReport";
import SearchResults from "./framework/SearchResults";
import About from "./pages/About";
import Activity from "./framework/Activity";
import EasyGuideCategoryList from "./framework/EasyGuideCategoryList";
import EasyGuideList from "./framework/EasyGuideList";
import EasyGuide from "./framework/EasyGuide";

// without this react-pdf errors out with: ReferenceError: Buffer is not defined
window.Buffer = window.Buffer || require("buffer").Buffer;

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
        element: <SectionList />,
      },
      {
        path: "s/:sectionId",
        element: <ChapterList />,
      },
      {
        path: "c/:chapterId",
        element: <ReportList />,
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
      {
        path: "egc",
        element: <EasyGuideCategoryList />,
      },
      {
        path: "eg/:categoryId",
        element: <EasyGuideList />,
      },
      {
        path: "g/:guideId",
        element: <EasyGuide />,
      },
      {
        path: "a",
        element: <Activity />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  { basename: "/" },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
