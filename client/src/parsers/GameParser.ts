import { range, every, clone } from "lodash";
import { ansi } from "./ansi";
import { BottomStatus, parseBottomStatusLine } from "./parseBottomStatusLine";
import { parseTopStatusLine, TopStatus } from "./parseTopStatusLine";
import { Sequences } from "./terminalParser";

export class GameParser {
  private x = 0;
  private y = 0;
  private _screen = range(1, 26).map(() => range(0, 80).map((c) => " "));
  private topStatusRaw!: string[];
  private bottomStatusRaw!: string[];
  topStatus: TopStatus | undefined;
  bottomStatus: BottomStatus | undefined;

  public get map() {
    return this._screen.map((p) => p.join("")).join("\n");
  }

  public get screen() {
    return this._screen;
  }

  constructor() {
    this.clear();
  }

  clear() {
    this.topStatusRaw = range(0, 80).map((p) => " ");
    this.bottomStatusRaw = range(0, 80).map((p) => " ");
  }

  parse(instructions: Sequences[]) {
    instructions?.forEach((inst) => {
      if (inst.instruction === "csi") {
        if (ansi.isClear(inst)) {
          this.clear();
        } else if (inst.flag === "H") {
          // https://vt100.net/docs/vt510-rm/CUP.html
          if (inst.params.length === 1 && inst.params[0] === 0) {
            this.x = 1;
            this.y = 1;
          } else if (inst.params.length === 2) {
            this.x = inst.params[1];
            this.y = inst.params[0];
          }
        }
      } else if (inst.instruction === "print") {
        // exclude top 1 and bottom 2 lines
        if (this.y > 1 && this.y < 23) {
          for (let i = 0; i < inst.s.length; i++) {
            this._screen[this.y][this.x] = inst.s[i];
            this.x++;
          }
        } else if (this.y === 23) {
          for (let i = 0; i < inst.s.length; i++) {
            {
              this.topStatusRaw[this.x] = inst.s[i];
              this.x++;
            }
          }
          const topStatus = parseTopStatusLine(
            this.topStatusRaw.join(""),
            !!this.topStatus
          );
          if (topStatus) this.topStatus = topStatus;
        } else if (this.y === 24) {
          for (let i = 0; i < inst.s.length; i++) {
            {
              this.bottomStatusRaw[this.x] = inst.s[i];
              this.x++;
            }
          }
          const bottomStatus = parseBottomStatusLine(
            this.bottomStatusRaw.join(""),
            !!this.bottomStatus
          );
          if (bottomStatus) this.bottomStatus = bottomStatus;
        }
      }
    });
    console.log("parse complete");
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
