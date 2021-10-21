import { range, every, clone } from "lodash";
import { Sequences } from "./terminalParser";

export class GameParser {
  private x = 0;
  private y = 0;
  private screen = range(1, 26).map(() => range(0, 80).map((c) => " "));
  private topStatusRaw = range(0, 80)
    .map((p) => " ")
    .join("");
  private bottomStatusRaw = range(0, 80)
    .map((p) => " ")
    .join("");
  public get map() {
    return trimMap(this.screen)
      .map((p) => p.join("").trimEnd())
      .join("\n");
  }
  parse(instructions: Sequences[]) {
    instructions.forEach((inst) => {
      if (inst.instruction === "csi") {
        if (inst.flag === "H") {
          // https://vt100.net/docs/vt510-rm/CUP.html
          if (inst.params.length === 1 && inst.params[0] === 0) {
            this.x = 1;
            this.y = 1;
          } else if (inst.params.length === 2) {
            this.x = inst.params[1];
            this.y = inst.params[0];
          }
        }
      }
      if (inst.instruction === "print") {
        // exclude top 1 and bottom 2 lines
        if (this.y > 1 && this.y < 23) {
          for (let i = 0; i < inst.s.length; i++) {
            const value = inst.s[i];
            if (!value.match(/[a-zA-Z@*$]/)) {
              this.screen[this.y][this.x] = value;
            } else {
              this.screen[this.y][this.x] = ".";
            }
            this.x++;
          }
        }
      }
    });
  }
}

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
