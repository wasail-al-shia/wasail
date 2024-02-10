import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Report from "./Report";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { DialogContext } from "../context/DialogContext";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import { bookName, lastCrumb, navBookLink } from "../utils/app";
import MainWrapper from "./MainWrapper";

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
      texts {
        id
        fragmentNo
        textEng
        textArb
      }
    }
  }`).then(({ reports }) => reports);

export default () => {
  const { openDialog } = React.useContext(DialogContext);
  const { chapterId } = useParams();
  const { data: reports = [], isFetching: fetchingReports } = useQuery(
    ["reports", chapterId],
    fetchReports
  );
  const { data: chapter = {}, isFetching: fetchingChapter } = useQuery(
    ["chapter", chapterId],
    fetchChapter
  );
  const nextSeqNo = Math.max(...reports.map((r) => r.reportNo)) + 1;

  const reportFields = [
    {
      name: "reportNo",
      label: "Report No",
      type: "number",
      size: "small",
      sx: { width: 100 },
      defaultValue: nextSeqNo,
      rules: { required: true },
      md: 12,
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
      crumbName: lastCrumb(chapter.section.sectionNo, chapter.chapterNo),
      toolTip: (
        <Stack>
          <Typography variant="h5">{chapter.section.nameEng}</Typography>
          <Typography variant="h6">{chapter.nameEng}</Typography>
        </Stack>
      ),
    },
  ];

  return (
    <Spinner open={fetchingChapter || fetchingReports}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper hasBreadcrumbs={true}>
        <Stack alignItems="center" direction="column" spacing={5}>
          {reports.map((report) => (
            <Report
              key={report.id}
              report={report}
              section={chapter.section || {}}
              book={chapter.section?.book || {}}
              chapter={chapter}
              onEdit={() =>
                openDialog("dataEntry", {
                  key: report.id,
                  title: "Update report",
                  dataQueryKeys: ["reports"],
                  fields: reportFields,
                  mutationApi: "updateReport",
                  defaultValues: report,
                  basePayload: { reportId: report.id },
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
        buttonText="Add Report"
        dataEntryProps={{
          key: "addreport",
          title: "Add report",
          fields: reportFields,
          dataQueryKeys: ["reports"],
          mutationApi: "addReport",
          basePayload: { chapterId: chapter.id },
        }}
      />
    </Spinner>
  );
};
