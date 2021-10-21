import { GameParser } from "parsers/GameParser";
import { Sequences } from "parsers/terminalParser";
import dungeon_screen from "./screens/dungeon_screen.json";
import dungeon_screen_2 from "./screens/dungeon_screen_2.json";

describe("GameParser", () => {
  describe("dungeon_screen", () => {
    const parser = new GameParser();
    parser.parse(dungeon_screen as Sequences[]);
    it("should parse map", () => {
      const map = "\n" + parser.map;
      console.log(map);
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
|.......-#
|.......|
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
