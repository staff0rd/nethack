import { Sequences } from "../../src/parsers/terminalParser";
import { GameParser } from "../../src/parsers/GameParser";
import one_move from "./one_move.json";
import { trimMap } from "./trimMap";

describe("one_move", () => {
  const parser = new GameParser();
  const sequences = one_move as Sequences[];
  const executeFrames = sequences
    .map((p, ix) => (p.instruction === "execute" && p.flag === 8 ? ix : -1))
    .filter((ix) => ix !== -1);
  console.warn("executeFrames", executeFrames, "total", sequences.length);

  parser.parse(sequences.slice(0, executeFrames[executeFrames.length - 2]));
  it("should parse map", () => {
    const { map, debug } = trimMap(parser.map);
    console.log(debug);
    expect(map).toBe(`
   --------
   .......|
   |#......
   -.%....|
   |......|
   ..?....|
   |......|
   -----.--
       ?f
       @
      ##
------.-
|......|
|....<.|
.......|
--------`);
  });
});
