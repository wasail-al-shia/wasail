import React from "react";
import Stack from "@mui/material/Stack";
import { generatePlainText, generateReference } from "../utils/app";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CopyToClipboardButton from "../kmui/CopyToClipboardButton";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { navReportLink } from "../utils/app";
import ReportHeader from "../kmui/ReportHeader";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useMutation, useQueryClient } from "react-query";
import { getMutation } from "../utils/graph-ql";

export default ({
  report,
  onEdit,
  onFragmentEdit,
  dataQueryKeys,
  easyGuideFragments,
  hue,
  lightness = 97.65,
}) => {
  const { isAdmin, isReviewer } = React.useContext(SessionContext);
  const { openDialog } = React.useContext(DialogContext);
  const responseKeys = ["message", "status", "id"];
  const queryClient = useQueryClient();
  const updateReportMutation = useMutation(
    getMutation("updateReport", responseKeys)
  );
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
        style: { fontSize: "1.1rem", fontFamily: "Overpass Variable" },
      },
      multiline: true,
      rows: 15,
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
      <ReportHeader report={report} />
      <Stack direction="row" spacing={3} alignItems="center">
        {isReviewer && easyGuideFragments && (
          <Stack direction="row" spacing={3}>
            {easyGuideFragments.map((f) => (
              <Chip
                size="small"
                color="error"
                variant="outlined"
                key={f.abbreviated}
                label={f.abbreviated}
              />
            ))}
          </Stack>
        )}
        {isReviewer && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={report.review}
                  onChange={(event) => {
                    updateReportMutation.mutate(
                      { reportId: report.id, review: event.target.checked },
                      {
                        onSuccess: (_response) => {
                          dataQueryKeys.forEach((key) =>
                            queryClient.invalidateQueries(key)
                          );
                        },
                      }
                    );
                  }}
                />
              }
              label="Review"
            />
          </FormGroup>
        )}
        {isReviewer && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={report.hide}
                  onChange={(event) => {
                    updateReportMutation.mutate(
                      { reportId: report.id, hide: event.target.checked },
                      {
                        onSuccess: (_response) => {
                          dataQueryKeys.forEach((key) =>
                            queryClient.invalidateQueries(key)
                          );
                        },
                      }
                    );
                  }}
                />
              }
              label="Hide"
            />
          </FormGroup>
        )}
        {isAdmin && (
          <AddIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: "addText",
                title: `Add Text: ${report.headingEng}`,
                fields: textFields,
                onlyDirty: false,
                dataQueryKeys,
                mutationApi: "addText",
                defaultValues: { reportId: report.id },
                basePayload: { reportId: report.id },
              })
            }
          />
        )}
        {isAdmin && (
          <AddCommentIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: "addComment",
                title: `Add Comment: ${report.headingEng}`,
                fields: commentFields,
                onlyDirty: false,
                dataQueryKeys,
                mutationApi: "addComment",
                defaultValues: {
                  reportId: report.id,
                  commentSeqNo: 1,
                  commentEng: "Shaykh Hurr Amili: ",
                },
                basePayload: { reportId: report.id },
              })
            }
          />
        )}
        {isReviewer && onEdit && (
          <EditNoteIcon sx={{ marginLeft: 2 }} size="small" onClick={onEdit} />
        )}
        {isReviewer && onFragmentEdit && (
          <EditNoteIcon
            sx={{ marginLeft: 2 }}
            size="small"
            onClick={onFragmentEdit}
          />
        )}
        {isAdmin && (
          <IconButton
            disabled={report.texts.length != 1}
            size="small"
            onClick={() =>
              openDialog("splitReport", {
                report,
                defaultValues: { ...report.texts[0] },
                dataQueryKeys,
              })
            }
          >
            <VerticalSplitIcon
              sx={{ color: report.texts.length != 1 ? "disabled" : "#000" }}
              size="small"
            />
          </IconButton>
        )}
        <Tooltip key="feedback" title="Report feedback">
          <IconButton
            onClick={() =>
              openDialog("dataEntry", {
                title: "Send Comment On " + report.headingEng,
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
        {report.reportNo > 0 && (
          <Tooltip key="view" title="Standalone View">
            <IconButton component={Link} to={navReportLink(report.id)}>
              <OpenInNewIcon
                sx={{ color: "primary.dark2", fontSize: "1.2rem" }}
                size="small"
              />
            </IconButton>
          </Tooltip>
        )}
        {report.reportNo > 0 && (
          <CopyToClipboardButton
            key="clipboard"
            retrieveTextToCopy={() => generatePlainText(report)}
          />
        )}
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
                dataQueryKeys,
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
    <Stack
      sx={{
        backgroundColor: `hsl(${hue}, 55%, ${lightness - 3}%)`,
        padding: 5,
      }}
      spacing={5}
    >
      <Typography align="justify" variant="comment">
        {parse(comment.commentEng)}
        {isAdmin && (
          <EditNoteIcon
            size="small"
            onClick={() =>
              openDialog("dataEntry", {
                key: report.id,
                title: `Update Comment: ${report.headingEng}`,
                dataQueryKeys,
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
        border: "1px solid gray",
        borderRadius: 1,
        width: "100%",
        backgroundColor:
          isReviewer && report.hide
            ? "primary.hide"
            : isReviewer && report.review
            ? "primary.review"
            : `hsl(${hue}, 50%, ${lightness}%)`,
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
      {report.reportNo > 0 && (
        <Typography sx={{ marginTop: 3 }} align="right" variant="footer">
          ({generateReference(report)})
        </Typography>
      )}
    </Stack>
  );
};
