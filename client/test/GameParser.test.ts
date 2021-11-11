import { clone, every } from "lodash";
import { GameParser } from "../src/parsers/GameParser";
import { Sequences } from "../src/parsers/terminalParser";
import dungeon_screen from "./screens/dungeon_screen.json";
import dungeon_screen_2 from "./screens/dungeon_screen_2.json";

const trimMap = (map: string) => {
  const screen = map.split("\n").map((s) => s.split(""));
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

  return result.map((row) => row.join("").trimEnd()).join("\n");
};

describe("GameParser", () => {
  describe("dungeon_screen", () => {
    const parser = new GameParser();
    parser.parse(dungeon_screen as Sequences[]);
    it("should parse map", () => {
      const map = "\n" + trimMap(parser.map);
      expect(map).toBe(`
         -----
         +...+
         |...|
        #%.%.|
        #-----
        ##
         #
         #
         #
         #
---.-----#
|.$f....-#
|.@.....|
|.......|
---------`);
    });
    it("should parse topStatus", () => {
      expect(parser.topStatus.rank).toBe("Stafford the Aspirant");
    });
    it("should parse bottomStatus", () => {
      expect(parser.bottomStatus?.maxHitPoints).toBe(16);
    });
  });
  describe("dungeon_screen_2", () => {
    it.skip("should parse map", () => {
      const parser = new GameParser();
      parser.parse(dungeon_screen_2 as Sequences[]);
      const map = "\n" + parser.map;
      console.log(map);
      expect(map).toBe(`
-------------
|............#
|...........|###
|...........|  #  -----
|...........|  ###-...-#
............|     |...|#
|...........|    #..<.|#
----.--------    #-----###
    ######       ##      #
         #        #      ###
         ###      #        #
           #      #        ###
           ##     #          #
         ---.-----#          ###    --------
         |.......-#            f    .......|
         |.......|             @#-.........|
         |.......|                  .......|
         ---------                  --------`);
    });
  });
});
