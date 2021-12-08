import { Typography, Box, useTheme, MenuItem } from "@mui/material";
import { useSelector } from "@xstate/react";
import { useContext, Children } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { LoggedOut } from "./LoggedOut";
import { LoggedIn } from "./LoggedIn";
import { States } from "../../machines/DgameLaunch";
import { Login } from "./Login";
import { Register } from "./Register";
import { Nethack } from "../nethack";
import { useInterpret } from "@xstate/react";
import { dgamelaunchMachine } from "../../machines/DgameLaunch";
import { XTerm } from "xterm-for-react";
import { MenuItems, RootMenu } from "../RootMenu";
import { EventTypes } from "../../machines/DgameLaunch/EventTypes";

const DgameLaunchComponent = () => {
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

type Props = {
  xtermRef: XTerm;
  menuItems: MenuItems;
};

export const DgameLaunch = ({ xtermRef, menuItems }: Props) => {
  const dgamelaunchService = useInterpret(
    dgamelaunchMachine.withContext({ xterm: xtermRef, isPlaying: false })
  );

  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <RootMenu
        items={[
          ...menuItems,
          {
            onClick: () => dgamelaunchService.send(EventTypes.PrintParser),
            text: "Print Terminal",
          },
        ]}
      ></RootMenu>
      <DgameLaunchComponent />
    </GlobalStateContext.Provider>
  );
};
