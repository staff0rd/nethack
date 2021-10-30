import { Box } from "@mui/system";
import * as PIXI from "pixi.js";
import React, { useRef, useEffect, useState } from "react";

interface PixiProps {
  backgroundColor?: number;
  onAppChange?: (app: PIXI.Application) => void;
  onResized?: () => void;
}

export const Pixi = ({
  backgroundColor,
  onAppChange,
  onResized,
}: PixiProps) => {
  const [app, setApp] = useState<PIXI.Application>();
  const pixiElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pixiElement.current) {
      app && app.destroy(true);
      const pixi = new PIXI.Application({
        resizeTo: pixiElement.current.parentElement!,
        backgroundColor: backgroundColor || 0xffffff,
      });
      setApp(pixi);
      pixiElement.current.appendChild(pixi.view);
      onAppChange && onAppChange(pixi);
    }
  }, [backgroundColor, pixiElement]);

  return (
    <Box id="pixi-root" sx={{ width: 900, height: 300 }} ref={pixiElement} />
  );
};
