import { parseMap } from "machines/DgameLaunch/parseMap";
import { Sequences } from "machines/DgameLaunch/terminalParser";
import dungeon_screen from "./screens/dungeon_screen.json";
import dungeon_screen_2 from "./screens/dungeon_screen_2.json";

describe("parseMap", () => {
  it("should parse dungeon_screen", () => {
    const map = "\n" + parseMap(dungeon_screen as Sequences[]);
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
  it("should parse dungeon_screen_2", () => {
    const map = "\n" + parseMap(dungeon_screen_2 as Sequences[]);
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
