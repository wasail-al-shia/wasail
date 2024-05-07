import React from "react";
import Typography from "@mui/material/Typography";

export const Heading4 = ({ children }) => (
  <Typography align="center" sx={{ color: "primary.dark2" }} variant="h4">
    {children}
  </Typography>
);

export const Heading5 = ({ children }) => (
  <Typography align="center" sx={{ color: "primary.dark2" }} variant="h5">
    {children}
  </Typography>
);
