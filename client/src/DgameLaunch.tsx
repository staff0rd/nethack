import { Typography } from "@mui/material";
import { useActor } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateContext";

export const DgameLaunch = () => {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.dgamelaunchService);
  return <Typography>{state.value}</Typography>;
};
