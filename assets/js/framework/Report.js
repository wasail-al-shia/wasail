import React from "react";
import Stack from "@mui/material/Stack";
import { generatePlainText, generateReference } from "../utils/app";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CopyToClipboardButton from "../kmui/CopyToClipboardButton";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { navReportLink } from "../utils/app";
import { MAX_WIDTH_CONTENT } from "../consts";

export default ({ report, onEdit }) => {
  const { isAdmin } = React.useContext(SessionContext);
  const { openDialog } = React.useContext(DialogContext);
  const nextSeqNo =
    report.texts.length > 0
      ? Math.max(...report.texts.map((t) => t.fragmentNo)) + 1
      : 1;
  const textFields = [
    {
      name: "fragmentNo",
      label: "Frag No",
      type: "number",
      size: "small",
      defaultValue: nextSeqNo,
      sx: { width: 80 },
      rules: { required: true },
    },
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
      rows: 10,
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
      rows: 10,
      md: 12,
    },
  ];

  const commentFields = [
    {
      name: "commentSeqNo",
      label: "Seq. No",
      type: "number",
      size: "small",
      sx: { width: 100 },
      rules: { required: true },
      md: 6,
    },
    {
      name: "commentArbkk",
      label: "Comment Arabic",
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
      rows: 10,
      md: 12,
    },
    {
      name: "commentEng",
      label: "Comment English",
      size: "small",
      type: "text",
      rules: { required: true },
      fullWidth: true,
      inputProps: {
        style: { fontSize: "1.0rem", fontFamily: "Overpass Variable" },
      },
      multiline: true,
      rows: 10,
      md: 12,
    },
  ];

  const ReportHeading = () => (
    <Stack direction="row" justifyContent="space-between">
      <Typography
        sx={{ color: "primary.dark" }}
        to={navReportLink(report.id)}
        underline={"hover"}
        component={Link}
        variant="h5"
      >
        {report.headingEng}
      </Typography>
      <Stack direction="row" alignItems="center">
        {isAdmin && (
          <AddIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: "addText",
                title: "Add Text",
                fields: textFields,
                onlyDirty: false,
                dataQueryKeys: ["reports"],
                mutationApi: "addText",
                defaultValues: { reportId: report.id },
                basePayload: { reportId: report.id },
              })
            }
          />
        )}
        {isAdmin && (
          <ChatBubbleOutlineIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: "addComment",
                title: "Add Comment",
                fields: commentFields,
                onlyDirty: false,
                dataQueryKeys: ["reports"],
                mutationApi: "addComment",
                defaultValues: { reportId: report.id },
                basePayload: { reportId: report.id },
              })
            }
          />
        )}
        {isAdmin && (
          <EditNoteIcon sx={{ marginLeft: 2 }} size="small" onClick={onEdit} />
        )}
        <Tooltip title="Standalone View">
          <IconButton component={Link} to={navReportLink(report.id)}>
            <OpenInNewIcon sx={{ fontSize: "1.2rem" }} size="small" />
          </IconButton>
        </Tooltip>
        <CopyToClipboardButton
          retrieveTextToCopy={() => generatePlainText(report)}
        />
      </Stack>
    </Stack>
  );

  const Fragment = ({ text, hasMultiple }) => (
    <Stack spacing={5}>
      <Typography dir="rtl" align="justify" variant="textArb">
        {text.textArb}
      </Typography>
      {!hasMultiple && <Divider />}
      <Typography align="justify" variant="textEng">
        {parse(text.textEng)}
        {isAdmin && (
          <EditNoteIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: report.id,
                title: `Update Text: ${report.headingEng}`,
                dataQueryKeys: ["reports"],
                fields: textFields,
                mutationApi: "updateText",
                defaultValues: text,
                basePayload: { textId: text.id },
                deleteApi: "deleteText",
                deletePayload: {
                  textId: text.id,
                },
              })
            }
          />
        )}
      </Typography>
    </Stack>
  );

  const Comment = ({ comment }) => (
    <Stack sx={{ backgroundColor: "primary.backdrop", padding: 5 }} spacing={5}>
      <Typography align="justify" variant="comment">
        Comment: {parse(comment.commentEng)}
        {isAdmin && (
          <EditNoteIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: report.id,
                title: `Update Comment: ${report.headingEng}`,
                dataQueryKeys: ["reports"],
                fields: commentFields,
                mutationApi: "updateComment",
                defaultValues: comment,
                basePayload: { commentId: comment.id },
                deleteApi: "deleteComment",
                deletePayload: {
                  commentId: comment.id,
                },
              })
            }
          />
        )}
      </Typography>
    </Stack>
  );

  return (
    <Stack
      sx={{
        maxWidth: MAX_WIDTH_CONTENT,
        minWidth: `min(99vw, ${MAX_WIDTH_CONTENT}px)`,
        border: "1px solid gray",
        borderRadius: 1,
        backgroundColor:
          isAdmin && report.review ? "primary.review" : "primary.paper",
        padding: 6,
      }}
    >
      <ReportHeading />
      <Stack spacing={5}>
        {report.texts
          ?.map((text) => (
            <Fragment
              hasMultiple={report.texts.length > 1}
              key={text.id}
              text={text}
            />
          ))
          .flatMap((el, i) => (i == 0 ? [el] : [<Divider key={i} />, el]))}
        {report.comments?.map((comment) => (
          <Comment
            hasMultiple={report.comments.length > 1}
            key={comment.id}
            comment={comment}
          />
        ))}
      </Stack>
      <Typography sx={{ marginTop: 3 }} align="right" variant="footer">
        ({generateReference(report)})
      </Typography>
    </Stack>
  );
};
