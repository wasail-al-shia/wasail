import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { HEADER_HEIGHT } from "../consts";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.header2,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "25rem",
    fontSize: "1.2rem",
    border: "1px solid #dadde9",
  },
}));

export default function ({ crumbDefs }) {
  return (
    <Breadcrumbs
      sx={{
        minHeight: HEADER_HEIGHT,
        marginTop: HEADER_HEIGHT,
        zIndex: 100,
        padding: 3,
        position: "fixed",
        backgroundColor: "primary.header",
        width: "100%",
      }}
      separator={<NavigateNextIcon />}
    >
      {crumbDefs.map((def) =>
        def.toolTip ? (
          <HtmlTooltip key={def.crumbName} title={def.toolTip}>
            <Stack
              sx={{
                padding: 1,
                borderRadius: 1,
              }}
              direction="row"
              backgroundColor="primary.header2"
              spacing={3}
            >
              <Typography variant="breadcrumb">{def.crumbName}</Typography>
              <InfoIcon size="small" />
            </Stack>
          </HtmlTooltip>
        ) : (
          <Typography
            key={def.crumbName}
            component={def.to ? Link : null}
            variant="breadcrumb"
            underline={def.to ? "hover" : "none"}
            to={def.to}
          >
            {def.crumbName}
          </Typography>
        )
      )}{" "}
    </Breadcrumbs>
  );
}
