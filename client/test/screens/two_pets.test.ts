import { Sequences } from "../../src/parsers/terminalParser";
import { GameParser } from "../../src/parsers/GameParser";
import two_pets from "./two_pets.json";
import { trimMap } from "./trimMap";

describe("two_pets", () => {
  const parser = new GameParser();
  parser.parse(two_pets as Sequences[]);
  it("should parse map", () => {
    const map = "\n" + trimMap(parser.map);
    console.log(map);
    expect(map).toBe(`
   --------
   .......|
   |#......
   -.%....|
   |......|
   ..?....|
   |.:@f..|
   -----.--
       ##
       #
      ##
------.-
|......|
|....<.|
.......|
--------`);
  });
});
