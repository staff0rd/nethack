import { Grid } from "@mui/material";
import { useSelector } from "@xstate/react";
import { GlobalStateContext } from "src/GlobalStateContext";
import { useContext } from "react";
import { StatusItem } from "./StatusItem";

export const StatusBar = () => {
  const services = useContext(GlobalStateContext);
  const topStatus = useSelector(
    services.dgamelaunchService,
    (state) => state.context.topStatus
  );
  const bottomStatus = useSelector(
    services.dgamelaunchService,
    (state) => state.context.bottomStatus
  );
  return (
    <>
      <Grid container spacing={1}>
        <Grid item>
          <StatusItem title="Strength" value={topStatus?.strength} />
        </Grid>
        <Grid item>
          <StatusItem title="Dexterity" value={topStatus?.dexterity} />
        </Grid>
        <Grid item>
          <StatusItem title="Constitution" value={topStatus?.constitution} />
        </Grid>
        <Grid item>
          <StatusItem title="Intelligence" value={topStatus?.intelligence} />
        </Grid>
        <Grid item>
          <StatusItem title="Wisdom" value={topStatus?.wisdom} />
        </Grid>
        <Grid item>
          <StatusItem title="Charisma" value={topStatus?.charisma} />
        </Grid>
        <Grid item>
          <StatusItem
            title="Alignment"
            value={`${topStatus?.alignment} (${topStatus?.alignmentModifier})`}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item>
          <StatusItem
            title="Dungeon Level"
            value={bottomStatus?.dungeonLevel}
          />
        </Grid>
        <Grid item>
          <StatusItem title="Gold" value={bottomStatus?.gold} />
        </Grid>
        <Grid item>
          <StatusItem
            title="Hit points"
            value={`${bottomStatus?.currentHitPoints} (${bottomStatus?.maxHitPoints})`}
          />
        </Grid>
        <Grid item>
          <StatusItem
            title="Spell Power"
            value={`${bottomStatus?.currentPower} (${bottomStatus?.maxPower})`}
          />
        </Grid>
        <Grid item>
          <StatusItem title="Armor Class" value={bottomStatus?.armorClass} />
        </Grid>
        <Grid item>
          <StatusItem
            title="Experience"
            value={`${bottomStatus?.experienceLevel}/${bottomStatus?.experiencePoints}`}
          />
        </Grid>
        <Grid item>
          <StatusItem title="Time" value={bottomStatus?.time} dontFlash />
        </Grid>
        <Grid item>
          <StatusItem title="Status" value={bottomStatus?.status || "Normal"} />
        </Grid>
      </Grid>
    </>
  );
};
