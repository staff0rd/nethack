import { Typography, Box, useTheme } from "@mui/material";
import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { LoggedOut } from "./LoggedOut";
import { LoggedIn } from "./LoggedIn";
import { States } from "../../machines/DgameLaunch";
import { Login } from "./Login";
import { Register } from "./Register";
import { Nethack } from "../nethack";

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
    case States.LoggedIn: {
      return <LoggedIn />;
    }
    case States.Nethack: {
      return <Nethack />;
    }
  }

  return <Typography>{state}</Typography>;
};
