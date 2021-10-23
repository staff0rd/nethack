import { Button, Grid, Typography } from "@mui/material";
import { useSelector } from "@xstate/react";
import { loginMachine } from "machines/DgameLaunch/loginMachine";
import { useContext } from "react";
import { ActorRefFrom } from "xstate";
import { GlobalStateContext } from "../../GlobalStateContext";
import { EventTypes } from "../../machines/DgameLaunch/dgamelaunchMachine";
import { Movement } from "../nethack/Movement";

export const LoggedOut = () => {
  const services = useContext(GlobalStateContext);
  const topStatus = useSelector(
    services.dgamelaunchService,
    (state) => state.context.topStatus
  );

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
      <Grid item sx={{ padding: 2 }}>
        <Movement />
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() =>
            services.dgamelaunchService.send(EventTypes.PrintParser)
          }
        >
          Print Terminal
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() =>
            services.dgamelaunchService.send(EventTypes.ClearParser)
          }
        >
          Clear Terminal
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h5">Strength</Typography>
        <Typography>{topStatus?.strength}</Typography>
      </Grid>
    </Grid>
  );
};
