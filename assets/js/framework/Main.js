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
      //cacheTime should always be bigger than staleTime
      staleTime: 15 * (60 * 1000), // 15 mins
      cacheTime: 20 * (60 * 1000), // 20 mins
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function Main() {
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
