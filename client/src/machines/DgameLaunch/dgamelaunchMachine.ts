import {
  AnyEventObject,
  createMachine,
  DoneInvokeEvent,
  EventObject,
  ExprWithMeta,
  send,
  SendExpr,
} from "xstate";
import { io } from "socket.io-client";
import { loginMachine, States as loginStates } from "./loginMachine";
import { registerMachine } from "./registerMachine";
import { XTerm } from "xterm-for-react";

export enum States {
  Init = "init",
  Disconnected = "disconnected",
  Home = "home",
  Login = "login",
  RegisterNewUser = "register-new-user",
  Automate = "automate",
}

export enum EventTypes {
  Connected = "connected",
  Disconnected = "disconnected",
  GoToLogin = "login",
  GoToRegisterNewUser = "register-new-user",
  Automate = "send-blank",
}

export type Events =
  | { type: EventTypes.Connected }
  | { type: EventTypes.Disconnected }
  | { type: EventTypes.GoToRegisterNewUser }
  | { type: EventTypes.Automate }
  | { type: EventTypes.GoToLogin };

export type Context = {
  xterm: React.RefObject<XTerm>;
};

const sendSocket = <TContext, TEvent extends EventObject, T>(
  payload:
    | string
    | (<TContext, TEvent extends EventObject>(c: TContext, e: any) => string)
) =>
  typeof payload === "string"
    ? send({ type: "data", payload }, { to: "socket" })
    : send((c, e) => ({ type: "data", payload: payload(c, e) }), {
        to: "socket",
      });

export const dgamelaunchMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "dgamelaunch",
  invoke: {
    id: "socket",
    src: (context) => (callback, onEvent) => {
      // see https://github.com/statelyai/xstate/issues/549#issuecomment-512004633
      const socket = io("http://localhost:3001", {
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
        transports: ["websocket"],
      });
      console.log("connecting to server");
      socket.on("connect", () => {
        callback(EventTypes.Connected);
      });
      socket.on("connect_error", (err) => console.error("socket error", err));
      // // Backend -> Browser
      socket.on("data", function (data) {
        context.xterm.current!.terminal.write(data);
        console.debug(data);
      });
      socket.on("conn", (data) => {
        console.log(data);
      });

      context.xterm.current!.terminal.onKey(function (ev) {
        socket.emit("data", ev.key);
      });

      socket.on("disconnect", function () {
        //term.write("\r\n*** Disconnected from backend ***\r\n");
        send(EventTypes.Disconnected);
      });

      onEvent((e) => {
        console.log("sending: ", e.payload);
        socket.emit(e.type, e.payload);
      });
    },
  },
  states: {
    [States.Init]: {
      on: {
        [EventTypes.Connected]: States.Home,
      },
    },
    [States.Disconnected]: {
      on: {
        [EventTypes.Connected]: States.Home,
      },
    },
    [States.Home]: {
      on: {
        [EventTypes.Disconnected]: States.Disconnected,
        [EventTypes.GoToLogin]: States.Login,
        [EventTypes.GoToRegisterNewUser]: States.RegisterNewUser,
        [EventTypes.Automate]: States.Automate,
      },
    },
    [States.RegisterNewUser]: {
      entry: sendSocket("r"),
      invoke: {
        src: () => registerMachine,
        id: "register",
        onDone: [
          {
            cond: (c, e) => e.data.result === loginStates.Cancel,
            actions: sendSocket("\n") as any,
            target: States.Home,
          },
        ],
      },
    },
    [States.Login]: {
      entry: sendSocket("l"),
      invoke: {
        src: loginMachine,
        id: "login",
        onDone: [
          {
            cond: (c, e) => e.data.result === loginStates.Cancel,
            actions: sendSocket("\n") as any,
            target: States.Home,
          },
          {
            cond: (c, e) => e.data.result === loginStates.LoggedIn,
            actions: [
              sendSocket((c, e) => `${e.data.username}\n`),
              sendSocket((c, e) => `${e.data.password}\n`),
            ],
            target: States.Home,
          },
        ],
      },
    },
    [States.Automate]: {
      entry: [
        sendSocket("l"),
        sendSocket("stafford\n"),
        sendSocket("stafford\n"),
      ],
    },
  },
});
