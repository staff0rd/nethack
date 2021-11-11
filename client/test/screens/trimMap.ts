import { clone, every, range } from "lodash";

export const trimMap = (map: string) => {
  const rows = map.split("\n");
  let minX = 1,
    maxX = 80;
  let minY = 0;
  const screen = rows.map((s, ix) => s.split(""));
  let result: string[][] = clone(screen);
  while (every(result, (row) => row[0] === " ")) {
    minX++;
    for (let y = 0; y < screen.length; y++) {
      result[y].shift();
    }
  }
  while (every(result, (row) => row[row.length - 1] === " ")) {
    maxX--;
    for (let y = 0; y < screen.length; y++) {
      result[y].pop();
    }
  }
  while (every(result[0], (column) => column[column.length - 1] === " ")) {
    result.shift();
    minY++;
  }
  while (
    every(
      result[result.length - 1],
      (column) => column[column.length - 1] === " "
    )
  ) {
    result.pop();
  }

  return {
    debug:
      "  " +
      range(minX - 2, maxX - 1)
        .map((x) => Math.floor(x / 10))
        .join("") +
      "\n" +
      "  " +
      range(minX - 2, maxX - 1)
        .map((x) => x % 10)
        .join("") +
      "\n" +
      result
        .map(
          (row, ix) =>
            (ix + minY).toString().padStart(2, "0") +
            " " +
            row.join("").trimEnd()
        )
        .join("\n"),
    map: result.map((row) => row.join("").trimEnd()).join("\n"),
  };
};
