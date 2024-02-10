import * as React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./Theme";
import Header from "./Header";
import { SessionProvider } from "../context/SessionContext";
import { DialogProvider } from "../context/DialogContext";
import { SnackProvider } from "../context/SnackContext";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function Main() {
  React.useEffect(() => console.log("Mounting Main!!"), []);
  return (
    <ThemeProvider theme={Theme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SnackProvider>
            <DialogProvider>
              <CssBaseline />
              <Header />
              <Outlet />
            </DialogProvider>
          </SnackProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
