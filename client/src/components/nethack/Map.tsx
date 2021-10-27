import { useContext, useEffect, useState } from "react";
import { Pixi } from "../Pixi";
import * as PIXI from "pixi.js";
import { GlobalStateContext } from "src/GlobalStateContext";
import { useSelector } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { nethackMachine } from "src/machines/nethackMachine";
import { red, grey, blueGrey } from "@mui/material/colors";

const WALL_COLOR = PIXI.utils.string2hex(grey[700]);
const CORRIDOR_COLOR = PIXI.utils.string2hex(grey[500]);
const FLOOR_COLOR = PIXI.utils.string2hex(grey[400]);
const BACKGROUND_COLOR = PIXI.utils.string2hex(blueGrey[900]);
const PLAYER_COLOR = PIXI.utils.string2hex(red[300]);
const UNKNOWN_COLOR = PIXI.utils.string2hex(red[600]);

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
            case "-": {
              drawTile(app, x, y, width, height, WALL_COLOR);
              break;
            }
            case "#": {
              drawTile(app, x, y, width, height, CORRIDOR_COLOR);
              break;
            }
            case ".": {
              drawTile(app, x, y, width, height, FLOOR_COLOR);
              break;
            }
            case "@": {
              drawTile(app, x, y, width, height, PLAYER_COLOR);
              break;
            }
            case " ":
              break;
            default: {
              drawTile(app, x, y, width, height, UNKNOWN_COLOR);
            }
          }
        }
      }
    }
  }, [map, app]);
  console.log(map);
  return <Pixi backgroundColor={BACKGROUND_COLOR} onAppChange={setApp} />;
};
function drawTile(
  app: PIXI.Application,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number
) {
  const g = new PIXI.Graphics()
    .beginFill(color)
    .drawRect(0, 0, width, height)
    .endFill();
  app.stage.addChild(g);
  g.position.set(x * width, y * height);
}
