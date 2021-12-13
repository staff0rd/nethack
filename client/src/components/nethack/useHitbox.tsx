import { useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { GlobalStateContext } from "src/GlobalStateContext";
import { EventTypes } from "src/machines/DgameLaunch/EventTypes";

const keys = ["h", "y", "k", "u", "l", "n", "j", "b"];

const getAngle = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

const getDegrees = (radians: number) => {
  return (radians * 180) / Math.PI;
};

const getRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

const getRotation = (
  player: PIXI.Graphics,
  width: number,
  height: number,
  event: PIXI.InteractionEvent,
  mapContainer: PIXI.Container
) => {
  var position = new PIXI.Point(player.position.x, player.position.y);
  var global = new PIXI.Point(event.data.global.x, event.data.global.y);

  var angle = getAngle(position.x, position.y, global.x, global.y);
  const degrees = Math.round(getDegrees(angle) / 45) * 45;
  return degrees;
};

export const useHitbox = (
  app: PIXI.Application | undefined,
  width: number,
  height: number,
  mapContainer: PIXI.Container,
  player: PIXI.Graphics
) => {
  const service = useContext(GlobalStateContext).dgamelaunchService;

  const emit = (key: string) => {
    service.send({ type: EventTypes.SocketEmit, value: key });
  };

  const [hitbox] = useState<PIXI.Graphics>(
    new PIXI.Graphics().beginFill(0xff0000, 0.001).drawRect(0, 0, 1, 1)
  );

  useEffect(() => {
    if (app) {
      hitbox.width = width * 80;
      hitbox.height = height * 25;
      hitbox.interactive = true;
      app.stage.addChild(hitbox);
      hitbox.on("pointermove", (event) => {
        const degrees = getRotation(player, width, height, event, mapContainer);
        player.rotation = getRadians(degrees);
      });
      hitbox.on("pointerdown", (event) => {
        const key =
          ((getRotation(player, width, height, event, mapContainer) + 180) %
            360) /
          45;
        emit(keys[key]);
      });
    }
  }, [hitbox, app]);
  return hitbox;
};
