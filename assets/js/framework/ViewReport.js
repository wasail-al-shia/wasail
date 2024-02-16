import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Spinner from "../kmui/Spinner";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import { generatePlainText, generateReference } from "../utils/app";
import Typography from "@mui/material/Typography";
import CopyToClipboardButton from "../kmui/CopyToClipboardButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import MainWrapper from "./MainWrapper";
import { MAX_WIDTH_CONTENT } from "../consts";
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
      comments {
        id
        commentSeqNo
        commentEng
        commentArb
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

export default ({ wsReportId }) => {
  const reportId = wsReportId || useParams().reportId;
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

  const Fragment = ({ text, hasMultiple }) => (
    <Stack spacing={5}>
      <Typography dir="rtl" align="justify" variant="textArb">
        {text.textArb}
      </Typography>
      {!hasMultiple && <Divider />}
      <Typography align="justify" variant="textEng">
        {parse(text.textEng)}
      </Typography>
    </Stack>
  );

  const Comment = ({ comment }) => (
    <Stack sx={{ backgroundColor: "primary.backdrop", padding: 5 }} spacing={5}>
      <Typography align="justify" variant="comment">
        Comment: {parse(comment.commentEng)}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingReport}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper hasBreadcrumbs={true}>
        <IconButton onClick={() => history.back()}>
          <ArrowBackIcon />
        </IconButton>
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
            <Box
              sx={{
                marginBottom: 5,
                padding: 3,
                backgroundColor: "primary.backdrop",
              }}
            >
              <Typography variant="h5">
                {bookName(chapter.section.book)}
              </Typography>
              <Typography variant="h6">
                {`Section ${section.sectionNo}: ${chapter.section.nameEng}`}
              </Typography>
              <Typography variant="h6">
                {`Chapter ${chapter.chapterNo}: ${chapter.nameEng}`}
              </Typography>
            </Box>
            <Stack spacing={5}>
              {report &&
                report.texts
                  ?.map((text) => (
                    <Fragment
                      key={text.id}
                      text={text}
                      hasMultiple={report.texts.length > 1}
                    />
                  ))
                  .flatMap((el, i) =>
                    i == 0 ? [el] : [<Divider key={i} />, el]
                  )}
              {report &&
                report.comments?.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    hasMultiple={report.comments.length > 1}
                  />
                ))}
            </Stack>
            <Typography sx={{ marginTop: 3 }} align="right" variant="footer">
              ({report && generateReference(report)})
            </Typography>
          </Stack>
        </Stack>
      </MainWrapper>
    </Spinner>
  );
};
