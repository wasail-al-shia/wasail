import React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";

export default function ({ buttonText, dataEntryProps }) {
  const { isAdmin } = React.useContext(SessionContext);
  const { openDialog } = React.useContext(DialogContext);
  if (!isAdmin) return null;
  return (
    <Fab
      sx={{ paddingRight: 7 }}
      variant="extended"
      size="small"
      color="primary"
      aria-label="add"
      onClick={() => openDialog("dataEntry", dataEntryProps)}
    >
      <AddIcon sx={{ mr: 1 }} />
      {buttonText}
    </Fab>
  );
}
