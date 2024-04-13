import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function ({ name, link, onClick }) {
  return (
    <Typography
      variant="h7"
      noWrap
      component={link && Link}
      to={link}
      onClick={onClick}
      sx={{
        color: "#fff",
        textDecoration: "none",
        textTransform: "uppercase",
        cursor: "pointer",
        "&:hover": {
          fontWeight: 700,
          color: "primary.backdrop",
          transform: "scale3d(1.05, 1.05, 1.05)",
        },
      }}
    >
      {name}
    </Typography>
  );
}
