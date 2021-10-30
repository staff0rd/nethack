import { assign, createMachine } from "xstate";

export enum States {
  Init = "init",
  Cancel = "cancel",
  Registered = "registered",
}

export enum EventTypes {
  ClickCancel = "ClickCancel",
  ClickRegister = "ClickRegister",
}

type RegisterEvent = {
  type: EventTypes.ClickRegister;
  username: string;
  password: string;
  email: string;
};

export type Events = { type: EventTypes.ClickCancel } | RegisterEvent;

export type Context = {
  username: undefined | string;
  password: undefined | string;
  email: undefined | string;
};

export const registerMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "register",
  context: {
    username: undefined,
    password: undefined,
    email: undefined,
  },
  states: {
    [States.Init]: {
      on: {
        [EventTypes.ClickCancel]: States.Cancel,
        [EventTypes.ClickRegister]: {
          target: States.Registered,
          actions: [
            assign<Context, RegisterEvent>({
              password: (c, e) => e.password,
              username: (c, e) => e.username,
              email: (c, e) => e.email,
            }),
          ],
        },
      },
    },
    [States.Registered]: {
      type: "final",
      data: {
        result: States.Registered,
        username: (c: Context) => c.username,
        password: (c: Context) => c.password,
        email: (c: Context) => c.email,
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
