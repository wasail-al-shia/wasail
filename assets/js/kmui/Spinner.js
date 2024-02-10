import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default ({ open = true, children }) => {
  return open ? (
    <CircularProgress
      size={30}
      thickness={3}
      color="inherit"
      sx={{
        color: "primary.dark",
        top: "50%",
        left: "50%",
        position: "absolute",
      }}
    />
  ) : (
    <Box sx={{ position: "relative" }}>{children}</Box>
  );
};
