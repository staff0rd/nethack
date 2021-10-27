export type TopStatus = {
  rank: string;
  strength: string;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  alignment: string;
  score: number;
};

export const parseTopStatusLine = (
  line: string,
  matchedBefore: boolean = true
): TopStatus | undefined => {
  const matches = line.match(
    /(.+)St:(\d+(?:\/\d+)?) Dx:(\d+) Co:(\d+) In:(\d+) Wi:(\d+) Ch:(\d+) +(.+) S:(\d+)/
  );
  if (matches?.length !== 10) {
    if (matchedBefore) {
      console.warn("matches", matches, matches?.length);
      console.warn("Could not match top status", line);
    }
  } else {
    return {
      rank: matches[1].trim(),
      strength: matches[2],
      dexterity: Number(matches[3]),
      constitution: Number(matches[4]),
      intelligence: Number(matches[5]),
      wisdom: Number(matches[6]),
      charisma: Number(matches[7]),
      alignment: matches[8],
      score: Number(matches[9]),
    };
  }
};
