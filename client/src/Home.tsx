import { Button, Paper } from "@mui/material";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateContext";
import { EventTypes } from "./machines/dgamelaunchMachine";

export const Home = () => {
  const services = useContext(GlobalStateContext);

  return (
    <Paper>
      <Button
        variant="contained"
        onClick={() => services.dgamelaunchService.send(EventTypes.Login)}
      >
        Login
      </Button>
      <Button variant="contained">Register new user</Button>
    </Paper>
  );
};
