import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { HEADER_HEIGHT } from "../consts";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";

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
    <Stack
      sx={{
        marginTop: HEADER_HEIGHT,
        backgroundColor: "primary.header2",
        position: "fixed",
        width: "100%",
        zIndex: 1,
      }}
      alignItems="center"
    >
      <Container maxWidth="lg">
        <Breadcrumbs
          sx={{
            minHeight: HEADER_HEIGHT,
            paddingTop: 3,
            paddingLeft: 3,
            ".MuiBreadcrumbs-separator": {
              margin: 2,
            },
          }}
          separator={<NavigateNextIcon />}
        >
          {crumbDefs.slice(onSmallScreen ? -3 : 0).map((def) => (
            <Crumb key={def.crumbName} def={def} />
          ))}
        </Breadcrumbs>
      </Container>
    </Stack>
  );
}
