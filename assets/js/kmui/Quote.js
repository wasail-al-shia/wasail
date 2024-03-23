import React from "react";
import Box from "@mui/material/Box";

export default ({ children }) => (
  <Box
    sx={{
      margin: 5,
      backgroundColor: "primary.backdrop",
      padding: 5,
      fontStyle: "italic",
    }}
  >
    {children}
  </Box>
);
