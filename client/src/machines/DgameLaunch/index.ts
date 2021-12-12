import { assign, createMachine, EventObject, forwardTo, send } from "xstate";
import { Socket as SocketIo } from "socket.io-client";
import { loginMachine, States as loginStates } from "./loginMachine";
import { registerMachine, States as registerStates } from "./registerMachine";
import { XTerm } from "xterm-for-react";
import {
  PrintSequence,
  Sequences,
  terminalParser,
} from "src/parsers/terminalParser";
import { nethackMachine } from "../nethackMachine";
import { EventTypes } from "./EventTypes";

export enum States {
  Init = "init",
  Disconnected = "disconnected",
  LoggedOut = "logged-out",
  Login = "login",
  RegisterNewUser = "register-new-user",
  LoggedIn = "logged-in",
  Nethack = "nethack",
}

export type ReceivedInstructionsEvent = {
  type: EventTypes.ReceivedInstructions;
  instructions: Sequences[];
};

export type KeydownEvent = { type: EventTypes.KeyDown; e: KeyboardEvent };

export type Events =
  | { type: EventTypes.Connected }
  | { type: EventTypes.Disconnected }
  | { type: EventTypes.GoToRegisterNewUser }
  | { type: EventTypes.Automate }
  | { type: EventTypes.ClearParser }
  | { type: EventTypes.PrintParser }
  | KeydownEvent
  | { type: EventTypes.SocketEmit; value: string }
  | { type: EventTypes.ReceivedData; data: string }
  | ReceivedInstructionsEvent
  | { type: EventTypes.GoToLogin }
  | { type: EventTypes.LoggedInDetected }
  | { type: EventTypes.Play }
  | { type: EventTypes.PlayDetected }
  | { type: EventTypes.LoggedOutDetected }
  | { type: EventTypes.RegisterDetected }
  | { type: EventTypes.LoginDetected };

export type Context = {
  xterm: XTerm;
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

type Socket = Pick<SocketIo, "emit" | "on" | "close">;

export const dgamelaunchMachine = (socket?: Socket) => {
  return createMachine<Context, Events>({
    initial: States.Init,
    id: "dgamelaunch",
    on: {
      [EventTypes.KeyDown]: {
        actions: forwardTo("socket"),
      },
      [EventTypes.PlayDetected]: States.Nethack,
      [EventTypes.ClearParser]: {
        actions: terminalParser.clear as any,
      },
      [EventTypes.PrintParser]: {
        actions: terminalParser.print as any,
      },
      [EventTypes.ReceivedInstructions]: {
        cond: (c) => c.isPlaying,
        actions: [
          send(
            (_, e) => ({
              type: EventTypes.ReceivedInstructions,
              instructions: e.instructions,
            }),
            { to: "nethack" }
          ),
        ],
      },
      [EventTypes.LoggedInDetected]: States.LoggedIn,
      [EventTypes.LoggedOutDetected]: States.LoggedOut,
      [EventTypes.ReceivedData]: {
        actions: [
          (c, e) => c.xterm.terminal.write(e.data),
          send((c, e) => {
            const instructions = terminalParser.parse(e.data);
            for (let i = 0; i < instructions.length; i++) {
              const { instruction } = instructions[i];
              if (instruction === "print") {
                const s = (instructions[i] as PrintSequence).s;
                if (s === "Please enter your username. (blank entry aborts)") {
                  return { type: EventTypes.LoginDetected };
                } else if (s.startsWith("Logged in as:")) {
                  return { type: EventTypes.LoggedInDetected };
                } else if (s.startsWith("Not logged in.")) {
                  return { type: EventTypes.LoggedOutDetected };
                } else if (s.startsWith("Welcome new user.")) {
                  return { type: EventTypes.RegisterDetected };
                } else if (s.startsWith("NetHack, Copyright 1985-")) {
                  return { type: EventTypes.PlayDetected };
                }
              }
            }
            return { type: EventTypes.ReceivedInstructions, instructions };
          }),
        ],
      },
    },
    invoke: {
      id: "socket",
      // see https://github.com/statelyai/xstate/issues/549#issuecomment-512004633
      src: (context) => (callback, onEvent) => {
        if (socket) {
          socket.on("connect", () => {
            callback(EventTypes.Connected);
          });
          socket.on("connect_error", (err) =>
            console.error("socket error", err)
          );

          // Backend -> Browser
          socket.on("data", function (data) {
            callback({ type: EventTypes.ReceivedData, data });
          });

          context.xterm.terminal.onKey((ev) => socket.emit("data", ev.key));
          socket.on("disconnect", function () {
            console.log("disconnected");
            send(EventTypes.Disconnected);
          });

          onEvent((e) => {
            switch (e.type) {
              case "data": {
                console.log("sending to socket", e.payload);
                socket.emit(e.type, e.payload);
                break;
              }
              case EventTypes.KeyDown: {
                context.xterm.terminal.keyDown(e.e);
                break;
              }
            }
          });
        }
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
            actions: [() => console.log("playing"), sendSocket("p") as any],
          },
          [EventTypes.PlayDetected]: States.Nethack,
        },
      },
      [States.Nethack]: {
        entry: assign<Context>({ isPlaying: true }),
        exit: assign<Context>({ isPlaying: false }),
        invoke: {
          id: "nethack",
          src: nethackMachine,
        },
        on: {
          [EventTypes.LoggedOutDetected]: States.LoggedOut,
          [EventTypes.SocketEmit]: {
            actions: sendSocket(
              (c, e: { type: EventTypes.SocketEmit; value: string }) => e.value
            ) as any,
          },
        },
      },
      [States.LoggedOut]: {
        on: {
          [EventTypes.Disconnected]: States.Disconnected,
          [EventTypes.GoToLogin]: {
            actions: sendSocket("l") as any,
          },
          [EventTypes.LoginDetected]: States.Login,

          [EventTypes.GoToRegisterNewUser]: {
            actions: sendSocket("r") as any,
          },
          [EventTypes.RegisterDetected]: States.RegisterNewUser,
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
        invoke: {
          src: () => registerMachine,
          id: "register",
          onDone: [
            {
              cond: (c, e) => e.data.result === registerStates.Cancel,
              actions: sendSocket("\n") as any,
            },
            {
              cond: (c, e) => e.data.result === registerStates.Registered,
              actions: [
                sendSocket((c, e) => `${e.data.username}\n`),
                sendSocket((c, e) => `${e.data.password}\n`),
                sendSocket((c, e) => `${e.data.password}\n`),
                sendSocket((c, e) => `${e.data.email}\n`),
              ],
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
            },
            {
              cond: (c, e) => e.data.result === loginStates.LoggedIn,
              actions: [
                sendSocket((c, e) => `${e.data.username}\n`) as any,
                sendSocket((c, e) => `${e.data.password}\n`) as any,
              ],
            },
          ],
        },
      },
    },
  });
};
