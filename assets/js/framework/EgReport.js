import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";
import ReportHeader from "../kmui/ReportHeader";
import { generateReference } from "../utils/app";

export default ({ report }) => {
  const Fragment = ({ text }) => (
    <Stack spacing={5}>
      <Typography align="justify" variant="textEng">
        {parse(text.textEng)}
      </Typography>
    </Stack>
  );
  const Comment = ({ comment }) => (
    <Stack
      sx={{
        backgroundColor: "primary.paper",
        padding: 5,
      }}
      spacing={5}
    >
      <Typography align="justify" variant="comment">
        {comment.commentEng}
      </Typography>
    </Stack>
  );

  return (
    <Stack
      sx={{
        border: "1px solid gray",
        borderRadius: 1,
        width: "100%",
        backgroundColor: "primary.backdrop",
        padding: 6,
      }}
    >
      <ReportHeader report={report} />
      <Stack sx={{ mt: 5 }} spacing={5}>
        {report.texts
          ?.map((text) => <Fragment key={text.id} text={text} />)
          .flatMap((el, i) => (i == 0 ? [el] : [<Divider key={i} />, el]))}
        {report.comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        <Typography sx={{ marginTop: 3 }} align="right" variant="footer">
          ({generateReference(report)})
        </Typography>
      </Stack>
    </Stack>
  );
};
