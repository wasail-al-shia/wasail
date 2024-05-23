import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import Divider from "@mui/material/Divider";

export default ({ report }) => {
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

  return (
    <Stack
      sx={{
        border: "1px solid gray",
        borderRadius: 1,
        width: "100%",
        backgroundColor: "primary.paper",
        padding: 6,
      }}
    >
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
      </Stack>
    </Stack>
  );
};
