import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

export default ({ children }) => (
  <Container maxWidth="lg">
    <Stack
      sx={{
        backgroundColor: "primary.paper",
        paddingLeft: "0.875rem",
        paddingRight: "0.875rem",
        paddingBottom: "0.875rem",
      }}
      spacing={3}
    >
      {children}
    </Stack>
  </Container>
);
