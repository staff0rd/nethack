import { Button, Grid } from "@mui/material";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { EventTypes } from "../../machines/DgameLaunch/dgamelaunchMachine";

export const LoggedIn = () => {
  const services = useContext(GlobalStateContext);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => services.dgamelaunchService.send(EventTypes.Play)}
        >
          Play
        </Button>
      </Grid>
    </Grid>
  );
};
