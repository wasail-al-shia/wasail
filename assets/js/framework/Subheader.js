import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { HEADER_HEIGHT } from "../consts";
import { SessionContext } from "../context/SessionContext";
import { DialogContext } from "../context/DialogContext";

export default function () {
  const { pathname } = useLocation();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
  console.log("pathname=", pathname);
  const contactDialogFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      fullWidth: true,
      size: "small",
      md: 12,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
      md: 12,
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      fullWidth: true,
      size: "small",
      md: 12,
    },
    {
      name: "comment",
      label: "Comment",
      type: "text",
      size: "small",
      fullWidth: true,
      multiline: true,
      rules: { required: true },
      rows: 5,
      md: 12,
    },
  ];
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        backgroundColor: "primary.header2",
        marginTop: HEADER_HEIGHT,
        maxHeight: `calc(${HEADER_HEIGHT}  - 0.1rem)`,
        padding: 3,
        position: "fixed",
        width: "100%",
      }}
    >
      <Button
        sx={{ color: pathname == "/" ? "secondary.dark" : "primary.main" }}
        component={Link}
        to="/"
      >
        Home
      </Button>
      <Button
        sx={{ color: pathname == "/about" ? "secondary.dark" : "primary.main" }}
        component={Link}
        to="/about"
      >
        About
      </Button>
      <Button
        onClick={() =>
          openDialog("dataEntry", {
            title: "Conctact Us",
            fields: contactDialogFields,
            mutationApi: "processContactForm",
            btnText: "Send",
          })
        }
      >
        Contact
      </Button>
      {isAdmin && (
        <Button
          sx={{
            color: pathname == "/a" ? "secondary.dark" : "primary.main",
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
