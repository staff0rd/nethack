import { createContext } from "react";
import { ActorRefFrom } from "xstate";
import * as dgamelaunch from "./machines/DgameLaunch/dgamelaunchMachine";

type State = {
  dgamelaunchService: ActorRefFrom<typeof dgamelaunch.dgamelaunchMachine>;
};

export const GlobalStateContext = createContext<State>({} as State);
