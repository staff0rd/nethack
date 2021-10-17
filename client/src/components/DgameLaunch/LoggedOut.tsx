import { Button, Grid } from "@mui/material";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { EventTypes } from "../../machines/DgameLaunch/dgamelaunchMachine";
import { Movement } from "../nethack/Movement";

export const LoggedOut = () => {
  const services = useContext(GlobalStateContext);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => services.dgamelaunchService.send(EventTypes.GoToLogin)}
        >
          Login
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() =>
            services.dgamelaunchService.send(EventTypes.GoToRegisterNewUser)
          }
        >
          Register new user
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => services.dgamelaunchService.send(EventTypes.Automate)}
        >
          Automate
        </Button>
      </Grid>
      <Grid sx={{ padding: 2 }}>
        <Movement />
      </Grid>
    </Grid>
  );
};
