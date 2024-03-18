import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import ToolTip from "@mui/material/Tooltip";
import { SnackContext } from "../context/SnackContext";
import copy from "copy-to-clipboard";

export default function ({
  retrieveTextToCopy,
  snackMessage = "Copied to clipboard",
}) {
  const { createSnack } = React.useContext(SnackContext);

  const handleClick = () => {
    //the foll doesn't work on safari, so have to use the library
    //navigator.clipboard.writeText(textToCopy);

    copy(retrieveTextToCopy());
    createSnack(snackMessage);
  };

  return (
    <ToolTip title="Copy To Clipboard">
      <IconButton onClick={handleClick}>
        <ContentCopyIcon
          sx={{ color: "primary.dark2", fontSize: "1.2rem" }}
          size="small"
        />
      </IconButton>
    </ToolTip>
  );
}
