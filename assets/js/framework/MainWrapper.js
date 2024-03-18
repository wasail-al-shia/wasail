import React from "react";
import Box from "@mui/material/Box";
import { HEADER_HEIGHT } from "../consts";

export default function (props) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        marginTop: `calc((2 * ${HEADER_HEIGHT})  + 0.5rem)`,
        paddingLeft: "0.7rem",
        paddingRight: "0.7rem",
        alignContent: "center",
      }}
      spacing={5}
    >
      {props.children}
    </Box>
  );
}
