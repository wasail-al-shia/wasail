import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Spinner from "../kmui/Spinner";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import { generatePlainText, generateReference } from "../utils/app";
import Typography from "@mui/material/Typography";
import CopyToClipboardButton from "../kmui/CopyToClipboardButton";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import MainWrapper from "./MainWrapper";
import { MAX_WIDTH_CONTENT } from "../consts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  navBookLink,
  navChapterLink,
  bookName,
  chapterCrumb,
} from "../utils/app";

const fetchReport = ({ queryKey: [, reportId] }) =>
  request(`{
    report(reportId: ${reportId}) {
      id
      headingEng
      reportNo
      texts {
        id
        fragmentNo
        textEng
        textArb
      }
      chapter {
        id
        chapterNo
        nameEng
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
    }
  }`).then(({ report }) => report);

export default ({ wasReportId }) => {
  const reportId = wasReportId || useParams().reportId;
  const location = useLocation();
  const fromSearchResults = location.state?.fromSearchResults;
  const { data: report, isFetching: fetchingReport } = useQuery({
    queryKey: ["report", reportId],
    queryFn: fetchReport,
    placeholderData: {
      texts: [],
      chapter: {
        section: {
          book: {},
        },
      },
    },
  });

  const section = report.chapter.section;
  const chapter = report.chapter;

  const ReportHeading = () => (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="h4" component="div">
        {report.headingEng}
      </Typography>
      <CopyToClipboardButton
        retrieveTextToCopy={() => generatePlainText(report)}
      />
    </Stack>
  );

  const crumbDefs = !fetchingReport && [
    {
      crumbName: "Library",
      to: "/",
    },
    {
      to: navBookLink(chapter.section.book.id),
      crumbName: bookName(chapter.section.book),
    },
    {
      crumbName: chapterCrumb(chapter.section.sectionNo, chapter.chapterNo),
      to: navChapterLink(chapter.id),
    },
    {
      crumbName: report.headingEng,
    },
  ];

  return (
    <Spinner open={fetchingReport}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper hasBreadcrumbs={true}>
        {fromSearchResults && (
          <Button
            size="small"
            startIcon={<ArrowBackIosIcon size="small" />}
            variant="outlined"
            onClick={() => history.back()}
          >
            Back to Search Results
          </Button>
        )}
        <Stack spacing={2} sx={{ padding: 5 }}>
          <Typography variant="h5">
            {`Section ${section.sectionNo}: ${chapter.section.nameEng}`}
          </Typography>
          <Typography variant="h6">
            {`Chapter ${chapter.chapterNo}: ${chapter.nameEng}`}
          </Typography>
        </Stack>
        <Stack alignItems="center">
          <Stack
            sx={{
              maxWidth: MAX_WIDTH_CONTENT,
              minWidth: `min(99vw, ${MAX_WIDTH_CONTENT}px)`,
              border: "1px solid gray",
              borderRadius: 1,
              backgroundColor: "primary.paper",
              padding: 6,
            }}
          >
            <ReportHeading />
            {report &&
              report.texts?.map((text) => (
                <Stack key={text.id} spacing={5}>
                  <Typography dir="rtl" align="justify" variant="textArb">
                    {text.textArb}
                  </Typography>
                  <Divider />
                  <Typography align="justify" variant="textEng">
                    {parse(text.textEng)}
                  </Typography>
                </Stack>
              ))}
            <Typography sx={{ marginTop: 3 }} align="right" variant="footer">
              (
              {report &&
                generateReference({
                  book: report.chapter.section.book,
                  section: report.chapter.section,
                  chapter: report.chapter,
                  report,
                })}
              )
            </Typography>
          </Stack>
        </Stack>
      </MainWrapper>
    </Spinner>
  );
};
