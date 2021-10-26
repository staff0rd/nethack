import { GameParser } from "src/parsers/GameParser";
import { BottomStatus } from "src/parsers/parseBottomStatusLine";
import { TopStatus } from "src/parsers/parseTopStatusLine";
import { assign, createMachine, forwardTo, send, sendParent } from "xstate";
import { ReceivedInstructionsEvent, KeydownEvent } from "./DgameLaunch";
import { EventTypes as DgameEventTypes } from "./DgameLaunch/EventTypes";

export enum States {
  Init = "init",
}

type UpdateBottomStatusEvent = {
  type: EventTypes.UpdateBottomStatus;
  status: BottomStatus;
};
type UpdateTopStatusEvent = {
  type: EventTypes.UpdateTopStatus;
  status: TopStatus;
};

export enum EventTypes {
  UpdateTopStatus = "update-top-status",
  UpdateBottomStatus = "update-bottom-status",
}

export type Events =
  | ReceivedInstructionsEvent
  | UpdateTopStatusEvent
  | KeydownEvent
  | UpdateBottomStatusEvent;

export type Context = {
  bottomStatus?: BottomStatus;
  topStatus?: TopStatus;
};

export const nethackMachine = createMachine<Context, Events>({
  initial: States.Init,
  id: "nethack",
  context: {},
  invoke: {
    id: "game-parser",
    src: () => (callback, onEvent) => {
      const gameParser = new GameParser();
      onEvent((e) => {
        if (e.type === DgameEventTypes.ReceivedInstructions) {
          gameParser.parse(e.instructions);
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
        }
      });
      const listener = (e: KeyboardEvent) =>
        callback({ type: DgameEventTypes.KeyDown, e });
      document.addEventListener("keydown", listener);
      return () => window.removeEventListener("keydown", listener);
    },
  },
  on: {
    [DgameEventTypes.ReceivedInstructions]: {
      actions: forwardTo("game-parser"),
    },
    [DgameEventTypes.KeyDown]: {
      actions: sendParent((c, e) => e),
    },
    [EventTypes.UpdateTopStatus]: {
      actions: assign<Context>({
        topStatus: (_, e) => {
          return (e as UpdateTopStatusEvent).status;
        },
      }) as any,
    },
    [EventTypes.UpdateBottomStatus]: {
      actions: assign<Context>({
        bottomStatus: (_, e) => (e as UpdateBottomStatusEvent).status,
      }) as any,
    },
  },
  states: {
    [States.Init]: {},
  },
});
