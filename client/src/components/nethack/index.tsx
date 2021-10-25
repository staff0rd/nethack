import { Button, Grid } from "@mui/material";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { EventTypes } from "../../machines/DgameLaunch/dgamelaunchMachine";
import { Movement } from "./Movement";
import { StatusBar } from "./StatusBar";

export const Nethack = () => {
  const services = useContext(GlobalStateContext);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Grid item sx={{ padding: 2 }}>
          <Movement />
        </Grid>
      </Grid>
      <Grid item>
        <StatusBar />
      </Grid>
    </Grid>
  );
};
