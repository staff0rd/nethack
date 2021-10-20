import { parseMap } from "machines/DgameLaunch/parseMap";
import { Sequences } from "machines/DgameLaunch/terminalParser";
import dungeon_screen from "./screens/dungeon_screen.json";

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
|.$f....-#    
|.@.....|     
|.......|     
---------     `);
  });
});
