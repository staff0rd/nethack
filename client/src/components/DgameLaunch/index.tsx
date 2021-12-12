import { Typography, Box, useTheme, MenuItem } from "@mui/material";
import { useSelector } from "@xstate/react";
import { useContext, useEffect, useState } from "react";
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
import { io } from "socket.io-client";
import json from "../../../test/screens/climb_stairs.json";

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
  xterm: XTerm;
  menuItems: MenuItems;
};

const socket = io("http://localhost:3001", {
  secure: true,
  reconnection: true,
  rejectUnauthorized: false,
  transports: ["websocket"],
});

export const DgameLaunchWithSocket = ({ xterm, menuItems }: Props) => {
  const dgamelaunchService = useInterpret(
    dgamelaunchMachine(socket).withContext({
      xterm,
      isPlaying: false,
    }),
    []
  );

  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <RootMenu
        items={[
          ...menuItems,
          {
            onClick: () => dgamelaunchService.send(EventTypes.ClearParser),
            text: "Clear Terminal",
            shouldClose: false,
          },
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

const data = [];

export const DgameLaunchExplorer = ({ xterm, menuItems }: Props) => {
  const [step, setStep] = useState(-1);
  const dgamelaunchService = useInterpret(
    dgamelaunchMachine().withContext({
      xterm,
      isPlaying: true,
    }),
    []
  );

  useEffect(() => {
    dgamelaunchService.send(EventTypes.PlayDetected);
  }, []);

  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <RootMenu
        items={[
          ...menuItems,
          {
            onClick: () => {
              const nextStep = step + 1;
              setStep(nextStep);
              dgamelaunchService.send({
                type: EventTypes.ReceivedData,
                data: json.data[nextStep],
              });
            },
            text: `Next ${step}`,
            shouldClose: false,
          },
          {
            onClick: () => dgamelaunchService.send(EventTypes.ClearParser),
            text: "Clear Terminal",
            shouldClose: false,
          },
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
