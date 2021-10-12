import { Button, Grid } from "@mui/material";
import { useContext } from "react";
import { GlobalStateContext } from "../GlobalStateContext";
import { EventTypes } from "../machines/DgameLaunch/dgamelaunchMachine";

export const Home = () => {
  const services = useContext(GlobalStateContext);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => services.dgamelaunchService.send(EventTypes.Login)}
        >
          Login
        </Button>
      </Grid>
      <Grid item>
        <Button variant="outlined">Register new user</Button>
      </Grid>
    </Grid>
  );
};
