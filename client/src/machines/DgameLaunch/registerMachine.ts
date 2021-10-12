import { createMachine } from "xstate";

export enum States {
  Init = "init",
  Cancel = "cancel",
  LoggedIn = "loggedin",
}

export enum EventTypes {
  SetUsername = "SetUsername",
  SetPassword = "SetPassword",
  ClickCancel = "ClickCancel",
  ClickRegister = "ClickRegister",
}

export type Events =
  | { type: EventTypes.SetUsername; username: string }
  | { type: EventTypes.SetPassword; password: string }
  | { type: EventTypes.ClickCancel }
  | { type: EventTypes.ClickRegister };

export type Context = { username: ""; password: "" };

export const registerMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "register",
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
