import { range, every, clone } from "lodash";
import { ansi } from "./ansi";
import { BottomStatus, parseBottomStatusLine } from "./parseBottomStatusLine";
import { parseTopStatusLine, TopStatus } from "./parseTopStatusLine";
import { Sequences } from "./terminalParser";

export class GameParser {
  private x = 0;
  private y = 0;
  private frame = 0;
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

  constructor(private minY = 2, private maxY = 22) {
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
        } else if (inst.flag === "C") {
          this.x++; // TODO: check if x is out of bounds
        } else if (inst.flag === "A") {
          // CURSOR UP
          this.y--; // TODO: check if y is out of bounds
        } else if (inst.flag === "K") {
          // DECSEL—Selective Erase in Line https://vt100.net/docs/vt510-rm/DECSEL.html
          if (inst.params[0] === 0) {
            // Erase from cursor to end of line
            for (let i = 0; i < 80 - this.x; i++) {
              this._screen[this.y][this.x + i] = " ";
            }
          } else throw new Error("not implemented");
        } else
          throw new Error(
            `Unknown csi instruction ${JSON.stringify(inst, null, 2)}`
          );
      } else if (inst.instruction === "print") {
        // exclude top 1 and bottom 2 lines
        if (this.y >= this.minY && this.y <= this.maxY) {
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
      } else if (inst.instruction === "execute") {
        switch (inst.flag) {
          case 8: {
            if (this.y > 0) {
              this.x--;
            }
            break;
          }
          case 13: {
            this.x = 0;
          }
          case 0:
            break;
          default:
            throw new Error(`unhandled execute flag ${inst.flag}`);
        }
      }
    });
    console.log("parse complete");
  }
}
