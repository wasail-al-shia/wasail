import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { navReportLink } from "../utils/app";

export default function ({ report }) {
  return (
    <Typography
      sx={{ color: "primary.dark2", "&:hover": { fontWeight: 700 } }}
      to={navReportLink(report.id)}
      state={{ showBackButton: true }}
      underline={"hover"}
      component={Link}
      variant="h5"
    >
      {report.headingEng}
    </Typography>
  );
}
