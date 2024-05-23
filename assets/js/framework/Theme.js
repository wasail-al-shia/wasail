import { createTheme } from "@mui/material/styles";
import { HEADER_HEIGHT } from "../consts";
//import { createBreakpoints } from "@mui/system";
//const breakpoints = createBreakpoints({});

const Theme = createTheme({
  spacing: 2,
  palette: {
    primary: {
      main: "#274472",
      light: "#9c9a98",
      dark: "#474645",
      contrastText: "#d9d3cf",

      dark2: "#773e16",
      hide: "#ddd",

      header: "#b7aca4",
      header1: "#cec6c2",
      header2: "#d9d3cf",
      header3: "#e3e0dd",
      backdrop: "#efecea",
      paper: "#fcf9f6",

      review: "#edd5d5",
      gray: "#eee",
    },
    secondary: {
      main: "#939848",
      light: "#ffb27d",
      dark: "#b95224",
    },
  },
  typography: {
    allVariants: {
      fontFamily: "Overpass Variable",
      fontSize: "1.075rem",
      fontWeight: 400,
    },
    fontFamily: [
      "Overpass Variable",
      "Radio Canada Variable",
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
    h5a: {
      fontSize: "1.55rem",
      fontWeight: 500,
      fontFamily: ["Noto Naskh Arabic Variable"].join(", "),
    },
    h6: {
      fontSize: "1.05rem",
      fontWeight: 500,
    },
    h6a: {
      fontSize: "1.4rem",
      fontWeight: 500,
      fontFamily: ["Noto Naskh Arabic Variable"].join(", "),
    },
    h7: {
      fontSize: "0.9rem",
      fontWeight: 400,
    },
    breadcrumb: {
      fontSize: "1.0rem",
      fontWeight: 400,
    },
    footer: {
      fontSize: "0.9rem",
      fontWeight: 300,
    },
    reportRange: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    termsOfUse: {
      fontSize: "0.7rem",
      fontWeight: 200,
    },
    textEng: {
      fontSize: "1.1rem",
      lineHeight: "1.4rem",
      fontWeight: 400,
    },
    comment: {
      fontSize: "0.9rem",
      lineHeight: "1.1rem",
      fontWeight: 300,
    },
    textArb: {
      fontFamily: ["Noto Naskh Arabic Variable"].join(", "),
      fontSize: "1.4rem",
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
