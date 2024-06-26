import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { MAX_WIDTH_CONTENT, HEADER_HEIGHT } from "../consts";
import { SessionContext } from "../context/SessionContext";
import { DialogContext } from "../context/DialogContext";
import { formatIsoStrToLocal } from "../utils/date";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContactDialogProps } from "../utils/contact";

export default function () {
  const { pathname } = useLocation();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin, mostRecentReport } = React.useContext(SessionContext);
  const onSmallScreen = useMediaQuery("(max-width:600px)");
  const contactDialogProps = useContactDialogProps();
  return (
    <Stack
      sx={{
        backgroundColor: "primary.header2",
        marginTop: HEADER_HEIGHT,
        position: "fixed",
        width: "100%",
        zIndex: 1,
      }}
      alignItems="center"
    >
      <Stack
        direction="row"
        sx={{
          maxHeight: `calc(${HEADER_HEIGHT}  - 0.1rem)`,
          maxWidth: MAX_WIDTH_CONTENT,
          minWidth: `min(98vw, ${MAX_WIDTH_CONTENT}px)`,
          paddingTop: 3,
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center">
          <Button
            sx={{
              minWidth: 0,
              color: pathname == "/" ? "secondary.dark" : "primary.dark2",
            }}
            component={Link}
            to="/"
          >
            Home
          </Button>
          <Button
            sx={{
              minWidth: 0,
              color: pathname == "/about" ? "secondary.dark" : "primary.dark2",
            }}
            component={Link}
            to="/about"
          >
            About
          </Button>
          <Button
            sx={{ minWidth: 0, color: "primary.dark2" }}
            onClick={() => openDialog("dataEntry", contactDialogProps)}
          >
            Contact
          </Button>
          {isAdmin && (
            <Button
              sx={{
                minWidth: 0,
                color: pathname == "/a" ? "secondary.dark" : "primary.dark2",
              }}
              component={Link}
              to="/a"
            >
              Activity
            </Button>
          )}
        </Stack>
        {!onSmallScreen && (
          <Typography sx={{ marginRight: 5 }} variant="footer">
            Last Updated: {formatIsoStrToLocal(mostRecentReport.insertedAt)}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
