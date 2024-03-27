import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Report from "./Report";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import {
  bookName,
  sectionName,
  chapterName,
  sectionCrumb,
  chapterCrumb,
  navBookLink,
  navSectionLink,
} from "../utils/app";
import MainWrapper from "./MainWrapper";
import { replace } from "../utils/obj";
import { flipParenthesis } from "../utils/string";

const fetchChapter = ({ queryKey: [, chapterId] }) =>
  request(`{
    chapter(chapterId: ${chapterId}) {
      id
      chapterNo
      nameEng
      nameArb
      descEng
      descArb
      section {
        id
        sectionNo
        nameEng
        book {
          id
          nameEng
          code
          volumeNo
        }
      }
    }
  }`).then(({ chapter }) => chapter);

const fetchReports = ({ queryKey: [, chapterId] }) =>
  request(`{
    reports(chapterId: ${chapterId}) {
      id
      chapterId
      reportNo
      headingEng
      review
      hide 
      texts {
        id
        fragmentNo
        textEng
        textArb
      }
      comments {
        id
        commentSeqNo
        commentEng
        commentArb
      }
    }
  }`).then(({ reports }) => reports);

export default () => {
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
  const { chapterId } = useParams();
  const { data: reports = [], isFetching: fetchingReports } = useQuery(
    ["reports", chapterId],
    fetchReports
  );
  const { data: chapter, isFetching: fetchingChapter } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: fetchChapter,
    placeholderData: {
      section: {
        book: {},
      },
    },
  });
  const nextSeqNo =
    reports.length > 0 ? Math.max(...reports.map((r) => r.reportNo)) + 1 : null;

  const reportFields = [
    {
      name: "reportNo",
      label: "Report No",
      type: "number",
      size: "small",
      sx: { width: 100 },
      defaultValue: nextSeqNo,
      rules: { required: true },
      md: 4,
    },
    {
      name: "review",
      label: "Needs review?",
      type: "radio",
      defaultValue: "yes",
      md: 4,
      options: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    },
    {
      name: "hide",
      label: "Hide?",
      type: "radio",
      defaultValue: "no",
      md: 4,
      options: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    },
    {
      name: "headingEng",
      label: "Heading Eng",
      type: "text",
      size: "small",
      md: 12,
      fullWidth: true,
      rules: { required: true },
    },
  ];

  const reportFragFields = [
    {
      name: "textArb",
      label: "Text Arabic",
      type: "text",
      size: "small",
      inputProps: {
        dir: "rtl",
        style: {
          lineHeight: 1.5,
          fontSize: "1.5rem",
          fontFamily: "Noto Naskh Arabic Variable",
        },
      },
      fullWidth: true,
      multiline: true,
      rules: { required: true },
      rows: 7,
      md: 12,
    },
    {
      name: "textEng",
      label: "Text English",
      size: "small",
      type: "text",
      fullWidth: true,
      inputProps: {
        style: { fontSize: "1.0rem", fontFamily: "Overpass Variable" },
      },
      multiline: true,
      rules: { required: true },
      rows: 12,
      md: 12,
    },
  ];

  const crumbDefs = !fetchingChapter && [
    {
      to: "/",
      crumbName: "Library",
    },
    {
      to: navBookLink(chapter.section.book.id),
      crumbName: bookName(chapter.section.book),
    },
    {
      to: navSectionLink(chapter.section.id),
      crumbName: sectionCrumb(
        chapter.section.sectionNo,
        chapter.section.nameEng
      ),
    },
    {
      crumbName: chapterCrumb(chapter.chapterNo, chapter.nameEng),
    },
  ];

  return (
    <Spinner open={fetchingChapter || fetchingReports}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper>
        <Stack spacing={3}>
          <Typography align="center" variant="h5">
            {sectionName(chapter.section)}
          </Typography>
          <Typography align="center" variant="h5">
            {chapterName(chapter)}
          </Typography>
          {reports
            .filter((r) => isAdmin || !r.hide)
            .map((report) => (
              <Report
                key={report.id}
                report={{ ...report, chapter }}
                onEdit={() =>
                  openDialog("dataEntry", {
                    key: report.id,
                    title: "Update report",
                    dataQueryKeys: ["reports"],
                    fields: reportFields,
                    mutationApi: "updateReport",
                    defaultValues: {
                      ...report,
                      review: report.review ? "yes" : "no",
                      hide: report.hide ? "yes" : "no",
                    },
                    basePayload: { reportId: report.id },
                    transformPayload,
                    deleteApi: "deleteReport",
                    deletePayload: {
                      reportId: report.id,
                    },
                  })
                }
              />
            ))}
        </Stack>
      </MainWrapper>
      <FabAddButton
        buttonText="Report"
        dataEntryProps={{
          key: "addreport",
          title: "Add report",
          fields: reportFields.concat(reportFragFields),
          dataQueryKeys: ["reports"],
          onlyDirty: false,
          mutationApi: "addReportFrag",
          basePayload: { chapterId: chapter.id },
          defaultValues: nextSeqNo
            ? { headingEng: "Hadith " + nextSeqNo }
            : null,
          transformPayload,
        }}
      />
    </Spinner>
  );
};

const transformPayload = (payload) => {
  return replace(payload, [
    {
      key: "review",
      value: payload.review == "yes" ? true : false,
    },
    {
      key: "hide",
      value: payload.hide == "yes" ? true : false,
    },
    {
      key: "textArb",
      value: payload.textArb && flipParenthesis(payload.textArb),
    },
  ]);
};
