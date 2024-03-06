import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { HEADER_HEIGHT } from "../consts";
import { SessionContext } from "../context/SessionContext";
import { DialogContext } from "../context/DialogContext";
import { formatIsoStrToLocal } from "../utils/date";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function () {
  const { pathname } = useLocation();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin, mostRecentReport } = React.useContext(SessionContext);
  const onSmallScreen = useMediaQuery("(max-width:600px)");
  const contactDialogFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
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
      rules: { required: true },
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
      rows: 6,
      md: 12,
    },
  ];
  return (
    <Stack
      direction="row"
      sx={{
        backgroundColor: "primary.header2",
        marginTop: HEADER_HEIGHT,
        maxHeight: `calc(${HEADER_HEIGHT}  - 0.1rem)`,
        paddingTop: 3,
        paddingLeft: 3,
        position: "fixed",
        width: "100%",
        zIndex: 1,
      }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" alignItems="center">
        <Button
          sx={{ color: pathname == "/" ? "secondary.dark" : "primary.main" }}
          component={Link}
          to="/"
        >
          Home
        </Button>
        <Button
          sx={{
            color: pathname == "/about" ? "secondary.dark" : "primary.main",
          }}
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
      {!onSmallScreen && (
        <Typography sx={{ marginRight: 5 }} variant="footer">
          Last Updated: {formatIsoStrToLocal(mostRecentReport.insertedAt)}
        </Typography>
      )}
    </Stack>
  );
}
