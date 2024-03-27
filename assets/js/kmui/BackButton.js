import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default () => (
  <IconButton size="small" onClick={() => history.back()}>
    <ArrowBackIcon />
  </IconButton>
);
