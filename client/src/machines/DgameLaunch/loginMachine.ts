import { assign, createMachine, send } from "xstate";
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
  | { type: EventTypes.ClickLogin; username: string; password: string };

export type Context = { username: string; password: string };

export const loginMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "login",
  context: {
    username: "",
    password: "",
  },
  states: {
    [States.Init]: {
      on: {
        [EventTypes.ClickCancel]: States.Cancel,
        [EventTypes.ClickLogin]: {
          target: States.LoggedIn,
          actions: [
            () => console.log("bailing with login"),
            assign({
              password: (c, e) => e.password,
              username: (c, e) => e.username,
            }),
          ],
        },
      },
    },
    [States.LoggedIn]: {
      entry: () => console.log("enter loggedin"),
      type: "final",
      data: {
        result: States.LoggedIn,
        username: (c: Context) => c.username,
        password: (c: Context) => c.password,
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
