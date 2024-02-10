import React from "react";
import ConfirmDialog from "../kmui/ConfirmDialog";
import ContentDialog from "../dialogs/ContentDialog";
import DataEntry from "../dialogs/DataEntry";

const dialogMapping = {
  contentDialog: ContentDialog,
  confirmDialog: ConfirmDialog,
  dataEntry: DataEntry,
};
const DialogContext = React.createContext();

const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = React.useState({});

  const closeDialog = (key) =>
    setDialogs((prev) => {
      const dialog = prev[key];
      return { ...prev, [key]: { ...dialog, open: false } };
    });

  const openDialog = (key, props) =>
    setDialogs((prev) => ({ ...prev, [key]: { ...props, open: true } }));

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {Object.entries(dialogs).map(([key, props]) => {
        const Dialog = dialogMapping[key];
        return <Dialog key={key} {...props} onClose={() => closeDialog(key)} />;
      })}
      {children}
    </DialogContext.Provider>
  );
};

export { DialogContext, DialogProvider };
