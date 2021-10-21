import { GameParser } from "parsers/gameParser";
import { Sequences } from "parsers/terminalParser";
import dungeon_screen from "./screens/dungeon_screen.json";
import dungeon_screen_2 from "./screens/dungeon_screen_2.json";

describe("parseMap", () => {
  it("should parse dungeon_screen", () => {
    const parser = new GameParser();
    parser.parse(dungeon_screen as Sequences[]);
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
  it.skip("should parse dungeon_screen_2", () => {
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
