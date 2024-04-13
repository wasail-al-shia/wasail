import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { DialogContext } from "../context/DialogContext";
import { useNavigate } from "react-router-dom";
import { useContactDialogProps } from "../utils/contact";
import Typography from "@mui/material/Typography";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

const BurgerMenu = () => {
  const navigate = useNavigate();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "burgerMenu",
  });
  const { openDialog } = React.useContext(DialogContext);
  const contactDialogProps = useContactDialogProps();
  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
      }}
    >
      <MenuIcon {...bindTrigger(popupState)} />
      <Menu {...bindMenu(popupState)}>
        <MenuItem
          onClick={() => {
            popupState.close();
            navigate("/about");
          }}
        >
          About Us
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            openDialog("dataEntry", contactDialogProps);
          }}
        >
          Contact
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BurgerMenu;
