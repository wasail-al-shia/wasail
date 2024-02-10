import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

export default ({ open = true, message = "" }) => {
  return (
    <Backdrop
      sx={{
        zIndex: 1,
        color: "primary.dark",
      }}
      open={open}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid>{message}</Grid>
        <Grid>
          <CircularProgress color="inherit" />
        </Grid>
      </Grid>
    </Backdrop>
  );
};
