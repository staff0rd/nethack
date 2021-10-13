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
  LoggedOut = "logged-out",
  Login = "login",
  RegisterNewUser = "register-new-user",
}

export enum EventTypes {
  Connected = "connected",
  Disconnected = "disconnected",
  GoToLogin = "login",
  GoToRegisterNewUser = "register-new-user",
  Automate = "send-blank",
  SocketEmit = "socket-emit",
}

export type Events =
  | { type: EventTypes.Connected }
  | { type: EventTypes.Disconnected }
  | { type: EventTypes.GoToRegisterNewUser }
  | { type: EventTypes.Automate }
  | { type: EventTypes.SocketEmit; value: string }
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
        [EventTypes.Connected]: States.LoggedOut,
      },
    },
    [States.Disconnected]: {
      on: {
        [EventTypes.Connected]: States.LoggedOut,
      },
    },
    [States.LoggedOut]: {
      on: {
        [EventTypes.Disconnected]: States.Disconnected,
        [EventTypes.GoToLogin]: States.Login,
        [EventTypes.GoToRegisterNewUser]: States.RegisterNewUser,
        [EventTypes.Automate]: {
          actions: [
            sendSocket("l") as any,
            sendSocket("stafford\n"),
            sendSocket("stafford\n"),
            sendSocket("p"),
          ],
        },
        [EventTypes.SocketEmit]: {
          actions: sendSocket(
            (c, e: { type: EventTypes.SocketEmit; value: string }) => e.value
          ) as any,
        },
      },
    },
    [States.RegisterNewUser]: {
      entry: sendSocket("r") as any,
      invoke: {
        src: () => registerMachine,
        id: "register",
        onDone: [
          {
            cond: (c, e) => e.data.result === loginStates.Cancel,
            actions: sendSocket("\n") as any,
            target: States.LoggedOut,
          },
        ],
      },
    },
    [States.Login]: {
      entry: sendSocket("l") as any,
      invoke: {
        src: loginMachine,
        id: "login",
        onDone: [
          {
            cond: (c, e) => e.data.result === loginStates.Cancel,
            actions: sendSocket("\n") as any,
            target: States.LoggedOut,
          },
          {
            cond: (c, e) => e.data.result === loginStates.LoggedIn,
            actions: [
              sendSocket((c, e) => `${e.data.username}\n`),
              sendSocket((c, e) => `${e.data.password}\n`),
            ],
            target: States.LoggedOut,
          },
        ],
      },
    },
  },
});
