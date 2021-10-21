export type TopStatus = {
  rank: string;
  strength: string;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  alignment: string;
  alignmentModifier: number;
};

export const parseTopStatusLine = (line: string): TopStatus => {
  const matches = line.match(
    /(.+)St:(\d+(?:\/\d+)?) Dx:(\d+) Co:(\d+) In:(\d+) Wi:(\d+) Ch:(\d+) +(.+) S:(\d+)/
  );
  if (matches?.length !== 10) {
    console.warn("matches", matches, matches?.length);
    console.warn(line);
    throw new Error("Could not match topStatusLine");
  }
  return {
    rank: matches[1].trim(),
    strength: matches[2],
    dexterity: Number(matches[3]),
    constitution: Number(matches[4]),
    intelligence: Number(matches[5]),
    wisdom: Number(matches[6]),
    charisma: Number(matches[7]),
    alignment: matches[8],
    alignmentModifier: Number(matches[9]),
  };
};
