import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { HEADER_HEIGHT } from "../consts";
import { SessionContext } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { DialogContext } from "../context/DialogContext";

export default function () {
  const navigate = useNavigate();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
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
      sx={{
        backgroundColor: "primary.header2",
        minHeight: HEADER_HEIGHT,
        marginTop: HEADER_HEIGHT,
        padding: 3,
        position: "fixed",
        width: "100%",
      }}
    >
      <Button onClick={() => navigate("/")}>Library</Button>
      <Button onClick={() => navigate("/about")}>About</Button>
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
      {isAdmin && <Button onClick={() => navigate("/a")}>Activity</Button>}
    </Stack>
  );
}
