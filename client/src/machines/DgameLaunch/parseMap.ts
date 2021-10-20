import { Sequences } from "./terminalParser";
import { range, every, drop, clone } from "lodash";

export const parseMap = (instructions: Sequences[]): string => {
  const screen = range(1, 26).map(() => range(0, 80).map((c) => " "));

  let x = 1,
    y = 1;
  instructions.forEach((inst) => {
    if (inst.instruction === "csi") {
      if (inst.flag === "H") {
        // https://vt100.net/docs/vt510-rm/CUP.html
        if (inst.params.length === 1 && inst.params[0] === 0) {
          x = 1;
          y = 1;
        } else if (inst.params.length === 2) {
          x = inst.params[1];
          y = inst.params[0];
        }
      }
    }
    if (inst.instruction === "print") {
      // exclude top 1 and bottom 2 lines
      if (y > 1 && y < 23) {
        for (let i = 0; i < inst.s.length; i++) {
          try {
            screen[y][x] = inst.s[i];
          } catch {
            console.log(x, y);
          }
          x++;
        }
      }
    }
  });

  return trimMap(screen)
    .map((p) => p.join(""))
    .join("\n");
};

const trimMap = (screen: string[][]) => {
  let result: string[][] = clone(screen);
  while (every(result, (row) => row[0] === " ")) {
    for (let y = 0; y < screen.length; y++) {
      result[y].shift();
    }
  }
  while (every(result, (row) => row[row.length - 1] === " ")) {
    for (let y = 0; y < screen.length; y++) {
      result[y].pop();
    }
  }
  while (every(result[0], (column) => column[column.length - 1] === " ")) {
    result.shift();
  }
  while (
    every(
      result[result.length - 1],
      (column) => column[column.length - 1] === " "
    )
  ) {
    result.pop();
  }

  return result;
};
