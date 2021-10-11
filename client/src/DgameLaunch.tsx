import { Box, Button, Typography } from "@mui/material";
import { useActor, useSelector } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateContext";
import { Home } from "./Home";
import { States } from "./machines/dgamelaunchMachine";

export const DgameLaunch = () => {
  const globalServices = useContext(GlobalStateContext);
  const state = useSelector(
    globalServices.dgamelaunchService,
    (state) => state.value
  );

  switch (state) {
    case States.Home: {
      return <Home />;
    }
  }

  return <Typography>{state}</Typography>;
};
