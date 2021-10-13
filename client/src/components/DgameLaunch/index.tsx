import { Typography, Box, useTheme } from "@mui/material";
import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { LoggedOut } from "./LoggedOut";
import { States } from "../../machines/DgameLaunch/dgamelaunchMachine";
import { Login } from "./Login";
import { Register } from "./Register";

export const DgameLaunch = () => {
  const globalServices = useContext(GlobalStateContext);
  const state = useSelector(
    globalServices.dgamelaunchService,
    (state) => state.value
  );
  const theme = useTheme();

  switch (state) {
    case States.LoggedOut: {
      return (
        <Box>
          <Typography variant="h1" sx={{ color: theme.palette.text.primary }}>
            nethack
          </Typography>
          <LoggedOut />
        </Box>
      );
    }
    case States.Login: {
      return <Login />;
    }
    case States.RegisterNewUser: {
      return <Register />;
    }
  }

  return <Typography>{state}</Typography>;
};