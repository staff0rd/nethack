import { CsiSequence } from "./terminalParser";

export const ansi = {
  isClear: (instruction: CsiSequence) => {
    // https://vt100.net/docs/vt510-rm/ED.html
    return (
      instruction.params.length === 1 &&
      instruction.params[0] === 2 &&
      instruction.flag === "J"
    );
  },
};
