import { Grid } from "@mui/material";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { Movement } from "./Movement";
import { StatusBar } from "./StatusBar";
import { Map } from "./Map";

export const Nethack = () => {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Map />
      </Grid>
      <Grid item>
        <Grid item>
          <Movement />
        </Grid>
      </Grid>
      <Grid item>
        <StatusBar />
      </Grid>
    </Grid>
  );
};
