import { createMachine } from "xstate";

enum States {
  Disconnected = "disconnected",
  Home = "home",
}

export type Events = { type: "CONNECT" };

export type Context = {};

export const dgamelaunchMachine = createMachine<Context, Events>({
  initial: States.Disconnected,
  id: "dgamelaunch",
  states: {
    [States.Disconnected]: {
      on: {
        CONNECT: States.Home,
      },
    },
    [States.Home]: {},
  },
});
