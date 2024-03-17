import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { HEADER_HEIGHT } from "../consts";
import InfoIcon from "@mui/icons-material/Info";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HtmlTooltip } from "./HtmlTooltip";

export default function ({ crumbDefs }) {
  const onSmallScreen = useMediaQuery("(max-width:600px)");
  const Crumb = ({ def }) => (
    <Typography
      key={def.crumbName}
      component={def.to ? Link : null}
      variant="breadcrumb"
      to={def.to}
      sx={{
        color: "primary.dark2",
        "&:hover": { fontWeight: def.to ? 700 : null },
      }}
    >
      {def.crumbName}
    </Typography>
  );
  return (
    <Breadcrumbs
      sx={{
        minHeight: HEADER_HEIGHT,
        marginTop: HEADER_HEIGHT,
        zIndex: 1,
        position: "fixed",
        paddingTop: 3,
        paddingLeft: 3,
        backgroundColor: "primary.header2",
        width: "100%",
        ".MuiBreadcrumbs-separator": {
          margin: 2,
        },
      }}
      separator={<NavigateNextIcon />}
    >
      {crumbDefs.slice(onSmallScreen ? -3 : 0).map((def) =>
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
              <Crumb def={def} />
              <InfoIcon size="small" />
            </Stack>
          </HtmlTooltip>
        ) : (
          <Crumb key={def.crumbName} def={def} />
        )
      )}
    </Breadcrumbs>
  );
}
