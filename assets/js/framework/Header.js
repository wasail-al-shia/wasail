import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, redirect } from "react-router-dom";
import { backend } from "../utils/axiosConfig";
import { SessionContext } from "../context/SessionContext";
import IconButton from "@mui/material/IconButton";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { HEADER_HEIGHT } from "../consts";
import SearchInput from "../kmui/SearchInput";
import { navSearchReultsLink } from "../utils/app";
import { useHotkeys } from "react-hotkeys-hook";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Header() {
  const navigate = useNavigate();
  const { name, avatarUrl, logout, isAdmin } = React.useContext(SessionContext);
  const onSmallScreen = useMediaQuery("(max-width:600px)");
  useHotkeys("ctrl+a", () => {
    console.log("ctrl+a");
    redirect("/auth/google");
  });

  const loggedIn = name != null;
  const renderLogo = () => (
    <Box
      component="img"
      sx={{
        cursor: "pointer",
        height: "1.5rem",
        width: "1.8rem",
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 1,
        padding: 0,
        margin: 0,
      }}
      src={"/images/ya_allah_logo.png"}
      onClick={() => (isAdmin ? navigate("/a") : navigate("/"))}
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
          <Typography
            mt={2}
            sx={{ color: "primary.paper" }}
            variant={onSmallScreen ? "siteHeaderSmall" : "siteHeader"}
            onClick={() => isAdmin && navigate("/")}
          >
            Wasail Al Shia
          </Typography>
          <Stack
            sx={{ marginLeft: "auto" }}
            alignItems="center"
            spacing={3}
            direction="row"
          >
            <SearchInput
              onEnter={(searchStr) =>
                navigate(navSearchReultsLink(searchStr), {
                  state: { searchStr },
                })
              }
            />
            {loggedIn ? (
              <Tooltip title={`Logout ${name}`}>
                <Box
                  component="img"
                  sx={{
                    height: "1.5rem",
                    width: "1.5rem",
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
