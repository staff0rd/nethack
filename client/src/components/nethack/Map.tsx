import { useContext, useEffect, useState } from "react";
import { Pixi } from "../Pixi";
import * as PIXI from "pixi.js";
import { GlobalStateContext } from "src/GlobalStateContext";
import { useSelector } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { nethackMachine } from "src/machines/nethackMachine";
import { red, grey, blueGrey, brown } from "@mui/material/colors";

const WALL_COLOR = PIXI.utils.string2hex(grey[700]);
const CORRIDOR_COLOR = PIXI.utils.string2hex(grey[500]);
const FLOOR_COLOR = PIXI.utils.string2hex(grey[400]);
const BACKGROUND_COLOR = PIXI.utils.string2hex(blueGrey[900]);
const PLAYER_COLOR = PIXI.utils.string2hex(red[300]);
const UNKNOWN_COLOR = PIXI.utils.string2hex(red[600]);
const DOOR_COLOR = PIXI.utils.string2hex(brown[500]);

export const Map = () => {
  const [app, setApp] = useState<PIXI.Application>();
  const services = useContext(GlobalStateContext);
  const nethackService = useSelector(services.dgamelaunchService, (state) => {
    return state.children.nethack as ActorRefFrom<typeof nethackMachine>;
  });
  const map = useSelector(nethackService, (state) => state.context.map);
  useEffect(() => {
    if (app && app.view && map) {
      const width = app.view.width / 80;
      const height = app.view.height / 25;
      console.log(`${width}x${height}`);
      const screen = map.split("\n");
      app.stage.removeChildren();
      for (let y = 0; y < screen.length; y++) {
        for (let x = 0; x < screen[y].length; x++) {
          switch (screen[y][x]) {
            case "|":
            case ">":
            case "<":
            case "-": {
              drawTile(app, x, y, width, height, screen[y][x], WALL_COLOR);
              break;
            }
            case "+": {
              drawTile(app, x, y, width, height, screen[y][x], DOOR_COLOR);
              break;
            }
            case "#": {
              drawTile(app, x, y, width, height, screen[y][x], CORRIDOR_COLOR);
              break;
            }
            case ".": {
              drawTile(app, x, y, width, height, screen[y][x], FLOOR_COLOR);
              break;
            }
            case "@": {
              drawTile(app, x, y, width, height, screen[y][x], PLAYER_COLOR);
              break;
            }
            case " ":
              break;
            default: {
              drawTile(app, x, y, width, height, screen[y][x], UNKNOWN_COLOR);
            }
          }
        }
      }
    }
  }, [map, app]);
  return <Pixi backgroundColor={BACKGROUND_COLOR} onAppChange={setApp} />;
};
function drawTile(
  app: PIXI.Application,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  color: number
) {
  const g = new PIXI.Graphics()
    .beginFill(color)
    .drawRect(0, 0, width, height)
    .endFill();
  app.stage.addChild(g);
  g.position.set(x * width, y * height);
  const text = new PIXI.Text(label, {
    fontFamily: "Ubuntu Mono",
    fontSize: 16,
  });
  text.position.set(width / 2, height / 2);
  text.pivot.set(text.width / 2, text.height / 2);
  text.resolution = 3;
  g.addChild(text);
}
