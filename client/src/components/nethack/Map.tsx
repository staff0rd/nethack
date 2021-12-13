import { useContext, useEffect, useState } from "react";
import { Pixi } from "../Pixi";
import * as PIXI from "pixi.js";
import { GlobalStateContext } from "src/GlobalStateContext";
import { useSelector } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { nethackMachine } from "src/machines/nethackMachine";
import { red, grey, blueGrey, brown } from "@mui/material/colors";
import { useHitbox } from "./useHitbox";

const WALL_COLOR = PIXI.utils.string2hex(grey[700]);
const CORRIDOR_COLOR = PIXI.utils.string2hex(grey[500]);
const FLOOR_COLOR = PIXI.utils.string2hex(grey[400]);
const BACKGROUND_COLOR = PIXI.utils.string2hex(blueGrey[900]);
const PLAYER_COLOR = PIXI.utils.string2hex(red[300]);
const UNKNOWN_COLOR = PIXI.utils.string2hex(red[600]);
const DOOR_COLOR = PIXI.utils.string2hex(brown[500]);

type Size = {
  width: number;
  height: number;
};

export const Map = () => {
  const [app, setApp] = useState<PIXI.Application>();
  const width = (app?.view.width ?? 1) / 80;
  const height = (app?.view.height ?? 1) / 25;
  const [player] = useState(createPlayer(PLAYER_COLOR, { width, height }));

  const [mapContainer] = useState<PIXI.Container>(new PIXI.Container());
  const hitbox = useHitbox(app, width, height, mapContainer, player);
  useEffect(() => {
    if (app) {
      app.stage.removeChildren();
      app.stage.addChild(mapContainer, hitbox);
      mapContainer.scale.set(1);
    }
  }, [app]);

  const services = useContext(GlobalStateContext);
  const nethackService = useSelector(services.dgamelaunchService, (state) => {
    return state.children.nethack as ActorRefFrom<typeof nethackMachine>;
  });

  const map = useSelector(nethackService, (state) => state.context.map);

  useEffect(() => {
    if (app && app.view && map) {
      const screen = map.split("\n");
      mapContainer.removeChildren();
      for (let y = 0; y < screen.length; y++) {
        for (let x = 0; x < screen[y].length; x++) {
          switch (screen[y][x]) {
            case "|":
            case ">":
            case "<":
            case "-": {
              drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                WALL_COLOR
              );
              break;
            }
            case "+": {
              drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                DOOR_COLOR
              );
              break;
            }
            case "#": {
              drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                CORRIDOR_COLOR
              );
              break;
            }
            case ".": {
              drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                FLOOR_COLOR
              );
              break;
            }
            case "@": {
              drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                FLOOR_COLOR
              );
              const tile = drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                PLAYER_COLOR,
                createPlayer(PLAYER_COLOR, { width, height }, player)
              );
              tile.position.x += width / 2;
              tile.position.y += height / 2;
              break;
            }
            case " ":
              break;
            default: {
              drawTile(
                mapContainer,
                x,
                y,
                width,
                height,
                screen[y][x],
                UNKNOWN_COLOR
              );
            }
          }
        }
      }
    }
  }, [map, app]);

  return <Pixi backgroundColor={BACKGROUND_COLOR} onAppChange={setApp} />;
};

function drawTile(
  mapContainer: PIXI.Container,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  color: number,
  reference?: PIXI.Graphics
): PIXI.Graphics {
  if (!reference) {
    reference = new PIXI.Graphics();
    reference.beginFill(color).drawRect(0, 0, width, height).endFill();
    const text = new PIXI.Text(label, {
      fontFamily: "Ubuntu Mono",
      fontSize: 16,
    });
    text.position.set(width / 2, height / 2);
    text.pivot.set(text.width / 2, text.height / 2);
    text.resolution = 3;
    reference.addChild(text);
  }
  mapContainer.addChild(reference);
  reference.position.set(x * width, y * height);
  return reference;
}

const createPlayer = (
  color: number,
  size: Size,
  reference?: PIXI.Graphics
): PIXI.Graphics => {
  const lineWidth = 1;
  var g = (reference ?? new PIXI.Graphics()).clear().beginFill(color);
  g.lineStyle(lineWidth, 0xff0000);
  g.drawEllipse(
    size.width / 2,
    size.height / 2,
    size.width / 2 - lineWidth / 2,
    size.height / 2 - lineWidth / 2
  );
  g.moveTo(size.width * 0.2, size.height * 0.5);
  g.lineTo(size.width * 0.8, size.height * 0.5);
  g.moveTo(size.width * 0.8, size.height * 0.5);
  g.lineTo(size.width * 0.5, size.height * 0.2);
  g.moveTo(size.width * 0.8, size.height * 0.5);
  g.lineTo(size.width * 0.5, size.height * 0.8);

  g.pivot.set(size.width / 2, size.height / 2);
  return g;
};
