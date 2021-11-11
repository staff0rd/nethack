import { Sequences } from "../../src/parsers/terminalParser";
import { GameParser } from "../../src/parsers/GameParser";
import dungeon_screen from "./dungeon_screen.json";
import { trimMap } from "./trimMap";

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
    expect(parser.topStatus!.rank).toBe("Stafford the Aspirant");
  });
  it("should parse bottomStatus", () => {
    expect(parser.bottomStatus?.maxHitPoints).toBe(16);
  });
});
