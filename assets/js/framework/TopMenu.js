import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { HEADER_HEIGHT } from "../consts";
import { SessionContext } from "../context/SessionContext";
import { DialogContext } from "../context/DialogContext";
import { useContactDialogProps } from "../utils/contact";

export default function () {
  const { pathname } = useLocation();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
  const contactDialogProps = useContactDialogProps();
  return (
    <Stack
      sx={{
        minHeight: HEADER_HEIGHT,
        maxHeight: HEADER_HEIGHT,
        marginTop: 2,
      }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Button
        sx={{
          minWidth: 0,
          color: "primary.header2",
        }}
        component={Link}
        to="/"
      >
        Wasail al Shia
      </Button>
      <Button
        sx={{
          minWidth: 0,
          color: "primary.header2",
        }}
        component={Link}
        to="/about"
      >
        About
      </Button>
      <Button
        sx={{
          minWidth: 0,
          color: "primary.header2",
        }}
        onClick={() => openDialog("dataEntry", contactDialogProps)}
      >
        Contact
      </Button>
      {isAdmin && (
        <Button
          sx={{
            minWidth: 0,
            color: "primary.header2",
          }}
          component={Link}
          to="/a"
        >
          Activity
        </Button>
      )}
    </Stack>
  );
}
