import React from "react";
import Stack from "@mui/material/Stack";
import { generatePlainText, generateReference } from "../utils/app";
import Typography from "@mui/material/Typography";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import CopyToClipboardButton from "../kmui/CopyToClipboardButton";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { navReportLink } from "../utils/app";
import { MAX_WIDTH_CONTENT } from "../consts";

export default ({ report, book, section, chapter, onEdit }) => {
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

  const ReportHeading = () => (
    <Stack direction="row" justifyContent="space-between">
      <Typography
        sx={{ color: "primary.dark" }}
        to={navReportLink(report.id)}
        underline={"hover"}
        component={Link}
        variant="h4"
      >
        {report.headingEng}
      </Typography>
      <Stack direction="row">
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
          <EditNoteIcon sx={{ marginLeft: 2 }} size="small" onClick={onEdit} />
        )}
        <CopyToClipboardButton
          textToCopy={generatePlainText({ book, section, chapter, report })}
        />
      </Stack>
    </Stack>
  );
  return (
    <Stack
      sx={{
        maxWidth: MAX_WIDTH_CONTENT,
        minWidth: `min(99vw, ${MAX_WIDTH_CONTENT}px)`,
        border: "1px solid gray",
        borderRadius: 1,
        backgroundColor: report.review ? "primary.review" : "primary.paper",
        padding: 6,
      }}
    >
      <ReportHeading />
      {report.texts?.map((text) => (
        <Stack key={text.id} spacing={5}>
          <Typography dir="rtl" align="justify" variant="textArb">
            {text.textArb}
          </Typography>
          <Divider />
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
      ))}
      <Typography sx={{ marginTop: 3 }} align="right" variant="footer">
        ({generateReference({ book, section, chapter, report })})
      </Typography>
    </Stack>
  );
};
