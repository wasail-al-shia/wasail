import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToolTip from "@mui/material/Tooltip";
import { SnackContext } from "../context/SnackContext";
import copy from "copy-to-clipboard";

export default function ({ textToCopy, snackMessage = "Copied to clipboard" }) {
  const { createSnack } = React.useContext(SnackContext);

  const handleClick = () => {
    //the foll doesn't work on safari, so have to use the library
    //navigator.clipboard.writeText(textToCopy);

    copy(textToCopy);
    createSnack(snackMessage);
  };

  return (
    <ToolTip title="Copy To Clipboard">
      <ContentCopyIcon
        sx={{ fontSize: "1.2rem" }}
        size="small"
        onClick={handleClick}
      />
    </ToolTip>
  );
}
