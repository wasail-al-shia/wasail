import { createTheme } from "@mui/material/styles";
import { HEADER_HEIGHT } from "../consts";
//import { createBreakpoints } from "@mui/system";
//const breakpoints = createBreakpoints({});

const Theme = createTheme({
  spacing: 2,
  palette: {
    primary: {
      main: "#274472",
      header: "#b7aca4",
      header2: "#d9d3cf",
      breadcrumb: "#dbd1cc",
      breadcrumb2: "#e3e0dd",
      paper: "#fcf9f6",
      backdrop: "#efecea",

      dark: "#474645",
      light: "#9c9a98",
      gray: "#eee",
    },
    secondary: {
      main: "#939848",
      light: "#ffb27d",
      dark: "#b95224",
    },
  },
  typography: {
    fontFamily: [
      "Radio Canada Variable",
      "Overpass Variable",
      "Noto Sans",
    ].join(", "),
    lineHeight: 1.2,

    siteHeader: {
      fontSize: "1.1rem",
      fontWeight: 700,
      textTransform: "uppercase",
      wordSpacing: "0.2rem",
    },
    siteHeaderSmall: {
      fontSize: "0.9rem",
      fontWeight: 500,
      textTransform: "uppercase",
      wordSpacing: "0.1rem",
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.0rem",
      fontWeight: 400,
    },
    h6a: {
      fontSize: "1.5rem",
      fontWeight: 400,
      fontFamily: ["Noto Naskh Arabic Variable"].join(", "),
    },
    breadcrumb: {
      fontSize: "1.0rem",
      fontWeight: 400,
    },
    footer: {
      fontSize: "1.0rem",
      fontWeight: 300,
    },
    textEng: {
      fontSize: "1.15rem",
      lineHeight: "1.5rem",
      fontWeight: 400,
    },
    textArb: {
      fontFamily: ["Noto Naskh Arabic Variable"].join(", "),
      fontSize: "1.5rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          position: "fixed",
          top: `calc(${HEADER_HEIGHT} + 0.3rem)`,
          right: "0.3rem",
        },
      },
    },
  },
});

export default Theme;
