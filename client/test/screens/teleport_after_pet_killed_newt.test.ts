import { Sequences } from "../../src/parsers/terminalParser";
import { GameParser } from "../../src/parsers/GameParser";
import teleport_after_pet_killed_newt from "./teleport_after_pet_killed_newt.json";
import { trimMap } from "./trimMap";

describe("teleport_after_pet_killed_newt", () => {
  const parser = new GameParser();
  const sequences = teleport_after_pet_killed_newt as Sequences[];
  const executeFrames = sequences
    .map((p, ix) => (p.instruction === "execute" && p.flag === 8 ? ix : -1))
    .filter((ix) => ix !== -1);
  console.warn("executeFrames", executeFrames, "total", sequences.length);

  parser.parse(sequences.slice(0, executeFrames[executeFrames.length - 2]));
  it("should parse map", () => {
    const map = "\n" + trimMap(parser.map);
    console.log(map);
    //     expect(map).toBe(`
    //    --------
    //    .......|
    //    |#......
    //    -.%....|
    //    |......|
    //    ..?....|
    //    |..f...|
    //    -----@--
    //        ##
    //        #
    //       ##
    // ------.-
    // |......|
    // |....<.|
    // .......|
    // --------`);
  });
});
// describe("teleport_after_pet_killed_newt", () => {
//   const parser = new GameParser(10, 12);
//   parser.parse(teleport_after_pet_killed_newt as Sequences[]);
//   it("should parse map", () => {
//     const map = "\n" + trimMap(parser.map);
//     console.log(map);
//     expect(map).toBe(`
// ..?....|`);
//   });
// });
