import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDialog(props) {
  const { title, text, yesText = "Yes", noText = "No", onConfirm } = props;

  const handleYes = () => {
    onConfirm();
    props.onClose();
  };

  const handleNo = () => {
    props.onClose();
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>{title}</DialogTitle>
      {text && (
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleYes} color="secondary">
          {yesText}
        </Button>
        <Button onClick={handleNo} color="primary">
          {noText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
