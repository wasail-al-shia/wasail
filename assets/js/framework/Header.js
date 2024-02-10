import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { backend } from "../utils/axiosConfig";
import { SessionContext } from "../context/SessionContext";
import IconButton from "@mui/material/IconButton";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { HEADER_HEIGHT } from "../consts";
import SearchInput from "../kmui/SearchInput";
import { navSearchReultsLink } from "../utils/app";

export default function Header() {
  const navigate = useNavigate();
  const { name, avatarUrl, logout } = React.useContext(SessionContext);

  const loggedIn = name != null;
  const renderLogo = () => (
    <Box
      component="img"
      sx={{
        cursor: "pointer",
        height: "1.75rem",
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "primary.main",
      }}
      src={"/images/wasail_al_shia.png"}
      onClick={() => navigate("/")}
    />
  );

  return (
    <Box>
      <AppBar sx={{ padding: 0, margin: 0 }} position="fixed">
        <Toolbar
          sx={{ minHeight: HEADER_HEIGHT, maxHeight: HEADER_HEIGHT }}
          variant="dense"
        >
          {renderLogo()}
          <Box m={3} />
          <Typography mt={2} variant="siteHeader">
            Wasail Al Shia
          </Typography>
          <Stack sx={{ marginLeft: "auto" }} spacing={5} direction="row">
            <SearchInput
              onEnter={(searchStr) => navigate(navSearchReultsLink(searchStr))}
            />
            {loggedIn ? (
              <Tooltip title={`Logout ${name}`}>
                <Box
                  component="img"
                  sx={{
                    height: 30,
                    width: 30,
                    borderRadius: "50%",
                  }}
                  alt="Avatar"
                  onClick={() => {
                    backend.delete("/auth/logout").then((response) => {
                      console.log("Logout response:", response);
                      logout();
                    });
                  }}
                  referrerPolicy="no-referrer"
                  src={avatarUrl}
                />
              </Tooltip>
            ) : (
              <IconButton
                sx={{ marginLeft: "auto" }}
                variant="contained"
                href="/auth/google"
              >
                <LockOpenIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
