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
import { MAX_WIDTH_CONTENT, HEADER_HEIGHT } from "../consts";
import SearchInput from "../kmui/SearchInput";
import { navSearchResultsLink, navWsReportLink } from "../utils/app";
import useMediaQuery from "@mui/material/useMediaQuery";
import { isNumeric } from "../utils/string";
import TopMenu from "./TopMenu";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  const navigate = useNavigate();
  const { name, avatarUrl, logout, isAdmin, mostRecentReport } =
    React.useContext(SessionContext);
  const onSmallScreen = useMediaQuery("(max-width:600px)");

  const loggedIn = name != null;
  const renderLogo = () => (
    <Box
      component="img"
      sx={{
        cursor: "pointer",
        height: "1.8rem",
        width: "2.0rem",
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 1,
        padding: 0,
        margin: 0,
      }}
      //https://fineartamerica.com/featured/allah--turquoise-and-gold-faraz-khan.html
      src={"/images/ws_allah_logo.png"}
      onClick={() => navigate("/")}
    />
  );

  const Title = () => (
    <Typography
      sx={{ color: "primary.paper" }}
      variant={onSmallScreen ? "siteHeaderSmall" : "siteHeader"}
    >
      Wasail Al Shia
    </Typography>
  );

  const Login = () =>
    loggedIn ? (
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
    );

  return (
    <Box>
      <AppBar sx={{ padding: 0, margin: 0 }} position="fixed">
        <Stack alignItems="center">
          <Toolbar
            sx={{
              minHeight: HEADER_HEIGHT,
              maxHeight: HEADER_HEIGHT,
              maxWidth: MAX_WIDTH_CONTENT,
              minWidth: `min(98vw, ${MAX_WIDTH_CONTENT}px)`,
            }}
            variant="dense"
          >
            <Stack
              sx={{
                minHeight: HEADER_HEIGHT,
                maxHeight: HEADER_HEIGHT,
                maxWidth: MAX_WIDTH_CONTENT,
                width: "100%",
                border: "2px solid red",
              }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={10}
            >
              <Stack direction="row" alignItems="center" spacing={5}>
                {!onSmallScreen ? renderLogo() : <BurgerMenu />}
              </Stack>
              {!onSmallScreen && <TopMenu />}
              <Stack direction="row" alignItems="center" spacing={5}>
                <SearchInput
                  onEnter={(searchStr) =>
                    isNumeric(searchStr) &&
                    Number(searchStr) <= mostRecentReport.id
                      ? navigate(navWsReportLink(Number(searchStr)), {
                          state: { showBackButton: true },
                        })
                      : navigate(navSearchResultsLink(searchStr), {
                          state: { searchStr },
                        })
                  }
                />
                <Login />
              </Stack>
            </Stack>
          </Toolbar>
        </Stack>
      </AppBar>
    </Box>
  );
}
