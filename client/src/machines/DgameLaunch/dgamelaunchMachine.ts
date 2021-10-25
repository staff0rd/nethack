import { assign, createMachine, EventObject, send } from "xstate";
import { io } from "socket.io-client";
import { loginMachine, States as loginStates } from "./loginMachine";
import { registerMachine } from "./registerMachine";
import { XTerm } from "xterm-for-react";
import { terminalParser } from "src/parsers/terminalParser";
import { GameParser } from "src/parsers/GameParser";
import { range } from "lodash";
import { TopStatus } from "src/parsers/parseTopStatusLine";
import { BottomStatus } from "src/parsers/parseBottomStatusLine";

export enum States {
  Init = "init",
  Disconnected = "disconnected",
  LoggedOut = "logged-out",
  Login = "login",
  RegisterNewUser = "register-new-user",
  LoggedIn = "logged-in",
  Nethack = "nethack",
}

export enum EventTypes {
  Connected = "connected",
  Disconnected = "disconnected",
  GoToLogin = "login",
  GoToRegisterNewUser = "register-new-user",
  Automate = "send-blank",
  SocketEmit = "socket-emit",
  ClearParser = "clear-parser",
  PrintParser = "print-parser",
  UpdateTopStatus = "update-top-status",
  UpdateBottomStatus = "update-bottom-status",
  LoginDetected = "login-detected",
  LoggedInDetected = "logged-in-detected",
  LoggedOutDetected = "logged-out-detected",
  Play = "play",
  PlayDetected = "play-detected",
}

type UpdateBottomStatusEvent = {
  type: EventTypes.UpdateBottomStatus;
  status: BottomStatus;
};
type UpdateTopStatusEvent = {
  type: EventTypes.UpdateTopStatus;
  status: TopStatus;
};

export type Events =
  | { type: EventTypes.Connected }
  | { type: EventTypes.Disconnected }
  | { type: EventTypes.GoToRegisterNewUser }
  | { type: EventTypes.Automate }
  | { type: EventTypes.ClearParser }
  | { type: EventTypes.PrintParser }
  | UpdateTopStatusEvent
  | UpdateBottomStatusEvent
  | { type: EventTypes.SocketEmit; value: string }
  | { type: EventTypes.GoToLogin }
  | { type: EventTypes.LoggedInDetected }
  | { type: EventTypes.Play }
  | { type: EventTypes.PlayDetected }
  | { type: EventTypes.LoggedOutDetected }
  | { type: EventTypes.LoginDetected };

export type Context = {
  xterm: React.RefObject<XTerm>;
  bottomStatus?: BottomStatus;
  topStatus?: TopStatus;
  isPlaying: boolean;
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
      const gameParser = new GameParser();
      console.log("connecting to server");
      socket.on("connect", () => {
        callback(EventTypes.Connected);
      });
      socket.on("connect_error", (err) => console.error("socket error", err));
      // // Backend -> Browser
      socket.on("data", function (data) {
        const instructions = terminalParser.parse(data);

        instructions.forEach((i) => {
          if (i.instruction === "print") {
            if (i.s === "Please enter your username. (blank entry aborts)") {
              callback({ type: EventTypes.LoginDetected });
            } else if (i.s.startsWith("Logged in as:")) {
              callback({ type: EventTypes.LoggedInDetected });
            } else if (i.s.startsWith("Not logged in.")) {
              callback({ type: EventTypes.LoggedOutDetected });
            } else if (i.s.startsWith("NetHack, Copyright 1985-")) {
              callback({ type: EventTypes.PlayDetected });
            }
          }
        });

        // TODO: only do this inside nethack
        gameParser.parse(instructions);
        if (gameParser.topStatus) {
          callback({
            type: EventTypes.UpdateTopStatus,
            status: gameParser.topStatus,
          });
        }
        if (gameParser.bottomStatus)
          callback({
            type: EventTypes.UpdateBottomStatus,
            status: gameParser.bottomStatus,
          });
        context.xterm.current!.terminal.write(data);
      });
      socket.on("conn", (data) => {
        console.log(data);
      });
      document.addEventListener("keydown", (e) => {
        console.log(context.isPlaying);
        if (context.isPlaying) {
          if (isNotFunctionKey(e)) {
            context.xterm.current?.terminal.keyDown(e);
          }
        }
      });
      context.xterm.current!.terminal.onKey(function (ev) {
        socket.emit("data", ev.key);
      });

      socket.on("disconnect", function () {
        send(EventTypes.Disconnected);
      });

      onEvent((e) => {
        if (e.type === "data") {
          console.log("sending: ", e.payload);
          socket.emit(e.type, e.payload);
        }
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
    [States.LoggedIn]: {
      on: {
        [EventTypes.Play]: {
          actions: sendSocket("p") as any,
        },
        [EventTypes.PlayDetected]: States.Nethack,
      },
    },
    [States.Nethack]: {
      entry: [
        assign<Context>({ isPlaying: true }),
        (c) => console.log("isPlaying", c.isPlaying),
      ],
      exit: [
        assign<Context>({ isPlaying: false }),
        (c) => console.log("isPlaying", c.isPlaying),
      ],
      on: {
        [EventTypes.LoggedInDetected]: States.LoggedIn,
        [EventTypes.LoggedOutDetected]: States.LoggedOut,
        [EventTypes.SocketEmit]: {
          actions: sendSocket(
            (c, e: { type: EventTypes.SocketEmit; value: string }) => e.value
          ) as any,
        },
        [EventTypes.UpdateTopStatus]: {
          actions: assign({
            topStatus: (_: any, e) => {
              return (e as UpdateTopStatusEvent).status;
            },
          }) as any,
        },
        [EventTypes.UpdateBottomStatus]: {
          actions: assign({
            bottomStatus: (_: any, e) => (e as UpdateBottomStatusEvent).status,
          }) as any,
        },
      },
    },
    [States.LoggedOut]: {
      on: {
        [EventTypes.LoggedInDetected]: States.LoggedIn,
        [EventTypes.Disconnected]: States.Disconnected,
        [EventTypes.GoToLogin]: {
          actions: sendSocket("l") as any,
        },
        [EventTypes.LoginDetected]: States.Login,

        [EventTypes.GoToRegisterNewUser]: States.RegisterNewUser,
        [EventTypes.ClearParser]: {
          actions: terminalParser.clear as any,
        },
        [EventTypes.PrintParser]: {
          actions: terminalParser.print as any,
        },
        [EventTypes.Automate]: {
          actions: [
            sendSocket("l") as any,
            sendSocket("stafford\n"),
            sendSocket("stafford\n"),
            sendSocket("p"),
          ],
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

const isNotFunctionKey = (e: KeyboardEvent) => {
  const functionKeys = range(1, 13).map((i) => `F${i}`);
  return !functionKeys.includes(e.key);
};
