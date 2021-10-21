import { Sequences } from "./terminalParser";
import { range, every, clone } from "lodash";

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
          const value = inst.s[i];
          if (!value.match(/[a-zA-Z@*$]/)) {
            screen[y][x] = value;
          } else {
            screen[y][x] = ".";
          }
          x++;
        }
      }
    }
  });

  return trimMap(screen)
    .map((p) => p.join("").trimEnd())
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

type TopStatus = {
  rank: string;
  strength: string;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  alignment: string;
  alignmentModifier: number;
};

type BottomStatus = {
  dungeonLevel: number;
  gold: number;
  currentHitPoints: number;
  maxHitPoints: number;
  currentPower: number;
  maxPower: number;
  armorClass: number;
  experienceLevel: number;
  experiencePoints: number;
  time: number;
  status: string;
};

export const parseTopStatusLine = (line: string): TopStatus => {
  const matches = line.match(
    /(.+)St:(\d+(?:\/\d+)?) Dx:(\d+) Co:(\d+) In:(\d+) Wi:(\d+) Ch:(\d+) +(.+) S:(\d+)/
  );
  if (matches?.length !== 10) {
    console.warn("matches", matches);
    throw new Error("Could not match topStatusLine");
  }
  return {
    rank: matches[1].trim(),
    strength: matches[2],
    dexterity: Number(matches[3]),
    constitution: Number(matches[4]),
    intelligence: Number(matches[5]),
    wisdom: Number(matches[6]),
    charisma: Number(matches[7]),
    alignment: matches[8],
    alignmentModifier: Number(matches[9]),
  };
};
export const parseBottomStatusLine = (line: string): BottomStatus => {
  const matches = line.match(
    /Dlvl:(\d+) +\$:(\d+) +HP:(\d+)\((\d+)\) +Pw:(\d+)\((\d+)\) +AC:(\d+) +Xp:(\d+)\/(\d+) +T:(\d+) +([A-Za-z]+)?/
  );
  if (matches?.length !== 12) {
    console.warn("matches", matches, matches?.length);
    throw new Error("Could not match bottomStatusLine");
  }
  return {
    dungeonLevel: Number(matches[1]),
    gold: Number(matches[2]),
    currentHitPoints: Number(matches[3]),
    maxHitPoints: Number(matches[4]),
    currentPower: Number(matches[5]),
    maxPower: Number(matches[6]),
    armorClass: Number(matches[7]),
    experienceLevel: Number(matches[8]),
    experiencePoints: Number(matches[9]),
    time: Number(matches[10]),
    status: matches[11] ?? "",
  };
};
