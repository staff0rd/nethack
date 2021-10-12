import { Typography, Box, useTheme } from "@mui/material";
import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "../GlobalStateContext";
import { Home } from "./Home";
import { States } from "../machines/DgameLaunch/dgamelaunchMachine";
import { Login } from "./Login";

export const DgameLaunch = () => {
  const globalServices = useContext(GlobalStateContext);
  const state = useSelector(
    globalServices.dgamelaunchService,
    (state) => state.value
  );
  const theme = useTheme();

  switch (state) {
    case States.Home: {
      return (
        <Box>
          <Typography variant="h1" sx={{ color: theme.palette.text.primary }}>
            nethack
          </Typography>
          <Home />
        </Box>
      );
    }
    case States.Login: {
      return <Login />;
    }
  }

  return <Typography>{state}</Typography>;
};
