import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { MAX_WIDTH_CONTENT, HEADER_HEIGHT } from "../consts";

export default function (props) {
  return (
    <Stack alignItems="center">
      <Stack
        sx={{
          maxWidth: MAX_WIDTH_CONTENT,
          minWidth: `min(98vw, ${MAX_WIDTH_CONTENT}px)`,
          position: "absolute",
          marginTop: `calc((2 * ${HEADER_HEIGHT})  + 0.5rem)`,
          paddingLeft: "0.7rem",
          paddingRight: "0.7rem",
        }}
        spacing={5}
      >
        {props.children}
      </Stack>
    </Stack>
  );
}
