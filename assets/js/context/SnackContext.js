import React, { createContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SnackContext = createContext();

function RenderSnack({ id, message, open, handleClose, severity }) {
  const messageId = `message-${id}`;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      ContentProps={{
        "aria-describedby": messageId,
      }}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>,
      ]}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

let uniqueId = 2;

const SnackProvider = ({ children }) => {
  const [{ current, queue }, setState] = useState({ current: null, queue: [] });

  function createSnack(message, options) {
    const id = uniqueId++;
    const snack = { id, message, open: true, ...options };

    if (current) {
      setState({ current, queue: queue.concat(snack) });
    } else {
      setState({ queue, current: snack });
    }

    return id;
  }

  function handleClose() {
    setState((currentState) => ({
      ...currentState,
      current: { ...currentState.current, open: false },
    }));
    // time to snack close animation
    setTimeout(openNext, 1000);
  }

  function openNext() {
    if (queue.length) {
      setState({ current: queue[0], queue: queue.slice(1) });
    } else {
      setState({ current: null, queue: [] });
    }
  }

  return (
    <SnackContext.Provider value={{ createSnack }}>
      {current && (
        <RenderSnack key={current.id} {...current} handleClose={handleClose} />
      )}
      {children}
    </SnackContext.Provider>
  );
};

export { SnackContext, SnackProvider };
