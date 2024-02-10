import React from "react";
import Box from "@mui/material/Box";
import { HEADER_HEIGHT } from "../consts";

export default function (props) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        marginTop: props.hasBreadcrumbs
          ? `calc((2 * ${HEADER_HEIGHT})  + 0.7rem)`
          : `calc(${HEADER_HEIGHT} + 0.7rem)`,
        paddingLeft: 5,
        paddingRight: 5,
      }}
      spacing={5}
    >
      {props.children}
    </Box>
  );
}
