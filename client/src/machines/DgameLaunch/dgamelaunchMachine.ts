import { createMachine, send } from "xstate";
import { io } from "socket.io-client";
import { loginMachine, States as loginStates } from "./loginMachine";

enum SocketEvents {
  Emit,
}

export enum States {
  Init = "init",
  Disconnected = "disconnected",
  Home = "home",
  Login = "login",
}

export enum EventTypes {
  Connected = "connected",
  Disconnected = "disconnected",
  Login = "login",
}

export type Events =
  | { type: EventTypes.Connected }
  | { type: EventTypes.Disconnected }
  | { type: EventTypes.Login };

export type Context = {};

export const dgamelaunchMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "dgamelaunch",
  invoke: {
    id: "socket",
    src: () => (callback, onEvent) => {
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
        console.log(data);
      });
      socket.on("conn", (data) => {
        console.log(data);
      });

      socket.on("disconnect", function () {
        //term.write("\r\n*** Disconnected from backend ***\r\n");
        send(EventTypes.Disconnected);
      });

      onEvent((e) => {
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
        [EventTypes.Login]: States.Login,
      },
    },
    [States.Login]: {
      entry: send({ type: "data", payload: "l" }, { to: "socket" }),
      invoke: {
        src: loginMachine,
        id: "login",
        onDone: [
          {
            cond: (c, e) => e.data.result === loginStates.Cancel,
            actions: [
              (c, e) => console.log(e.data),
              send({ type: "data", payload: "\n" }, { to: "socket" }),
            ],
            target: States.Home,
          },
        ],
      },
    },
  },
});
