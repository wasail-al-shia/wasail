import React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Spinner from "../kmui/Spinner";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Typography from "@mui/material/Typography";
import CopyToClipboardButton from "../kmui/CopyToClipboardButton";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import MainWrapper from "./MainWrapper";
import { DialogContext } from "../context/DialogContext";
import { MAX_WIDTH_CONTENT } from "../consts";
import Tooltip from "@mui/material/Tooltip";
import {
  generatePlainText,
  navSectionLink,
  navBookLink,
  navChapterLink,
  sectionName,
  chapterName,
  bookName,
  chapterCrumb,
  sectionCrumb,
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
  const { openDialog } = React.useContext(DialogContext);
  const reportId = wsReportId || useParams().reportId;
  const { state } = useLocation();
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
  const reportFeedbackFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
      md: 12,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
      md: 12,
    },
    {
      name: "comment",
      label: "Comment",
      type: "text",
      size: "small",
      fullWidth: true,
      multiline: true,
      rules: { required: true },
      rows: 6,
      md: 12,
    },
  ];

  const ReportHeading = () => (
    <Stack direction="row" justifyContent="space-between">
      <Typography sx={{ color: "primary.dark2" }} variant="h5" component="div">
        {report.headingEng}
      </Typography>
      <Stack direction="row" alignItems="center">
        <Tooltip title="Report feedback">
          <IconButton
            onClick={() =>
              openDialog("dataEntry", {
                title: "Report feedback on " + report.headingEng,
                basePayload: { report_id: report.id },
                fields: reportFeedbackFields,
                mutationApi: "processReportFeedback",
                btnText: "Send",
              })
            }
          >
            <ChatBubbleOutlineIcon
              sx={{ color: "primary.dark2", fontSize: "1.2rem" }}
              size="small"
            />
          </IconButton>
        </Tooltip>
        <CopyToClipboardButton
          retrieveTextToCopy={() => generatePlainText(report)}
        />
      </Stack>
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
      to: navSectionLink(chapter.section.id),
      crumbName: sectionCrumb(
        chapter.section.sectionNo,
        chapter.section.nameEng
      ),
    },
    {
      crumbName: chapterCrumb(chapter.chapterNo, chapter.nameEng),
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
        {parse(comment.commentEng)}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingReport}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <MainWrapper>
        {state?.showBackButton && (
          <IconButton onClick={() => history.back()}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <center>
          <Stack
            sx={{
              maxWidth: MAX_WIDTH_CONTENT,
              minWidth: `min(98vw, ${MAX_WIDTH_CONTENT}px)`,
              border: "1px solid gray",
              borderRadius: 1,
              backgroundColor: "primary.paper",
              padding: 6,
            }}
          >
            <ReportHeading />
            <Stack
              sx={{
                marginBottom: 5,
                padding: 3,
                backgroundColor: "primary.backdrop",
                width: "100%",
              }}
            >
              <Typography align="left" variant="h5">
                {bookName(chapter.section.book)}
              </Typography>
              <Typography align="left" noWrap variant="h6">
                {sectionName(section)}
              </Typography>
              <Typography align="left" noWrap variant="h6">
                {chapterName(chapter)}
              </Typography>
            </Stack>
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
          </Stack>
        </center>
      </MainWrapper>
    </Spinner>
  );
};
