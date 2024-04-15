import React from "react";
import Box from "@mui/material/Box";

export default ({ children }) => (
  <Box
    sx={{
      backgroundColor: "primary.backdrop",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
      fontStyle: "italic",
    }}
  >
    {children}
  </Box>
);
