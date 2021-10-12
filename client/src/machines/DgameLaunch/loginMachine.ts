import { createMachine, send } from "xstate";
import { io } from "socket.io-client";

export enum States {
  Init = "init",
  Cancel = "cancel",
  LoggedIn = "loggedin",
}

export enum EventTypes {
  SetUsername = "SetUsername",
  SetPassword = "SetPassword",
  ClickCancel = "ClickCancel",
  ClickLogin = "ClickLogin",
}

export type Events =
  | { type: EventTypes.SetUsername; username: string }
  | { type: EventTypes.SetPassword; password: string }
  | { type: EventTypes.ClickCancel }
  | { type: EventTypes.ClickLogin };

export type Context = { username: ""; password: "" };

export const loginMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "login",
  states: {
    [States.Init]: {
      on: {
        [EventTypes.ClickCancel]: States.Cancel,
      },
    },
    [States.Cancel]: {
      type: "final",
      data: {
        result: States.Cancel,
      },
    },
  },
});
