import React from "react";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import ToolTip from "@mui/material/Tooltip";
import { SnackContext } from "../context/SnackContext";
import copy from "copy-to-clipboard";

export default function ({
  title,
  retrieveTextToCopy,
  snackMessage = "Link copied to clipboard",
}) {
  const { createSnack } = React.useContext(SnackContext);

  const handleClick = () => {
    //the foll doesn't work on safari, so have to use the library
    //navigator.clipboard.writeText(textToCopy);

    copy(retrieveTextToCopy());
    createSnack(snackMessage);
  };

  return (
    <ToolTip title={title}>
      <IconButton
        sx={{ color: "primary.dark2" }}
        size="small"
        variant="contained"
        onClick={handleClick}
      >
        <ShareIcon size="small" />
      </IconButton>
    </ToolTip>
  );
}
