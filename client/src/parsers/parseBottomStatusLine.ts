export type BottomStatus = {
  dungeonLevel: number;
  gold: number;
  currentHitPoints: number;
  maxHitPoints: number;
  currentPower: number;
  maxPower: number;
  armorClass: number;
  experienceLevel: number;
  experiencePoints: number;
  time: number;
  status: string;
};

export const parseBottomStatusLine = (
  line: string,
  matchedBefore: boolean = true
): BottomStatus | undefined => {
  const matches = line.match(
    /Dlvl:(\d+) +\$:(\d+) +HP:(\d+)\((\d+)\) +Pw:(\d+)\((\d+)\) +AC:(\d+) +Xp:(\d+)\/(\d+) +T:(\d+) +([A-Za-z]+)?/
  );
  if (matches?.length !== 12) {
    if (matchedBefore) {
      console.warn("matches", matches, matches?.length);
      console.warn(line);
    }
  } else {
    return {
      dungeonLevel: Number(matches[1]),
      gold: Number(matches[2]),
      currentHitPoints: Number(matches[3]),
      maxHitPoints: Number(matches[4]),
      currentPower: Number(matches[5]),
      maxPower: Number(matches[6]),
      armorClass: Number(matches[7]),
      experienceLevel: Number(matches[8]),
      experiencePoints: Number(matches[9]),
      time: Number(matches[10]),
      status: matches[11] ?? "",
    };
  }
};
