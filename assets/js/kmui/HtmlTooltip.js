import { styled } from "@mui/material/styles";
import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

export const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.header2,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "25rem",
    border: "1px solid #dadde9",
  },
}));
