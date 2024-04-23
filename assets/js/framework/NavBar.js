import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { HEADER_HEIGHT } from "../consts";
import NavMenuItem from "../kmui/NavMenuItem";
import { SessionContext } from "../context/SessionContext";
import { DialogContext } from "../context/DialogContext";
import { useContactDialogProps } from "../utils/contact";
import { backend } from "../utils/axiosConfig";
import SearchInput from "../kmui/SearchInput";
import { isNumeric } from "../utils/string";
import { navSearchResultsLink, navWsReportLink } from "../utils/app";
import { Link } from "react-router-dom";
import BurgerMenu from "./BurgerMenu";

function NavBar() {
  const { name, avatarUrl, logout, isAdmin, isReviewer, mostRecentReport } =
    React.useContext(SessionContext);
  const { openDialog } = React.useContext(DialogContext);
  const contactDialogProps = useContactDialogProps();
  const navigate = useNavigate();
  const loggedIn = name != null;

  const pages = [
    {
      name: "about",
      link: "/about",
    },
    {
      name: "contact",
      onClick: () => openDialog("dataEntry", contactDialogProps),
    },
    {
      name: "activity",
      link: "/a",
      hide: !isAdmin && !isReviewer,
    },
  ];

  const Logo = () => (
    <Box
      component="img"
      sx={{
        cursor: "pointer",
        height: "1.5rem",
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 1,
        padding: 0,
        margin: 0,
        mr: 1,
      }}
      //https://fineartamerica.com/featured/allah--turquoise-and-gold-faraz-khan.html
      src={"/images/ws_allah_logo.png"}
      onClick={() => navigate("/")}
    />
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
    <AppBar sx={{ padding: 0, margin: 0 }} position="fixed">
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            minHeight: HEADER_HEIGHT,
            maxHeight: HEADER_HEIGHT,
            width: "100%",
            padding: 0,
            margin: 0,
          }}
          variant="dense"
        >
          <Stack
            justifyContent="space-between"
            sx={{
              minHeight: HEADER_HEIGHT,
              maxHeight: HEADER_HEIGHT,
              width: "100%",
            }}
            direction="row"
          >
            <Stack spacing={5} direction="row" alignItems="center">
              <Logo />
              <Typography
                variant="h5"
                noWrap
                component={Link}
                to={"/"}
                sx={{
                  "&:hover": {
                    fontWeight: 700,
                    color: "primary.backdrop",
                    transform: "scale3d(1.05, 1.05, 1.05)",
                  },
                  color: "#fff",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  pt: 2,
                }}
              >
                WASAIL AL SHIA
              </Typography>
            </Stack>
            <Stack spacing={5} direction="row" alignItems="center">
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
            </Stack>
            <Stack spacing={5} direction="row" alignItems="center">
              <BurgerMenu />
              <Stack
                direction="row"
                alignItems="flex-start"
                sx={{
                  display: { xs: "none", sm: "flex" },
                }}
                spacing={7}
              >
                {pages
                  .filter((p) => !p.hide)
                  .map((page) => (
                    <NavMenuItem
                      key={page.name}
                      name={page.name}
                      link={page.link}
                      onClick={page.onClick}
                    />
                  ))}
              </Stack>
              <Login />
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
