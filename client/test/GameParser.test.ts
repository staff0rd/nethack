import { GameParser } from "../src/parsers/GameParser";
import { Sequences } from "../src/parsers/terminalParser";
import dungeon_screen from "./screens/dungeon_screen.json";
import dungeon_screen_2 from "./screens/dungeon_screen_2.json";
import { trimMap } from "./screens/trimMap";

describe("GameParser", () => {
  describe("dungeon_screen_2", () => {
    it.skip("should parse map", () => {
      const parser = new GameParser();
      parser.parse(dungeon_screen_2 as Sequences[]);
      const map = "\n" + trimMap(parser.map);
      console.log(map);
      expect(map).toBe(`
-------------
|............#
|..........@|###
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
