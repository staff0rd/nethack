import { Grid } from "@mui/material";
import { useSelector } from "@xstate/react";
import { GlobalStateContext } from "src/GlobalStateContext";
import { useContext } from "react";
import { StatusItem } from "./StatusItem";
import { ActorRefFrom } from "xstate";
import { nethackMachine } from "src/machines/nethackMachine";

export const StatusBar = () => {
  const services = useContext(GlobalStateContext);
  const nethackService = useSelector(services.dgamelaunchService, (state) => {
    return state.children.nethack as ActorRefFrom<typeof nethackMachine>;
  });
  const topStatus = useSelector(
    nethackService,
    (state) => state.context.topStatus
  );
  const bottomStatus = useSelector(
    nethackService,
    (state) => state.context.bottomStatus
  );
  //if (!bottomStatus && !topStatus) return <></>;
  return (
    <>
      {topStatus && (
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
            <StatusItem title="Alignment" value={topStatus?.alignment} />
          </Grid>
          <Grid item>
            <StatusItem title="Score" value={topStatus?.score} />
          </Grid>
        </Grid>
      )}
      {bottomStatus && (
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
            <StatusItem
              title="Status"
              value={bottomStatus?.status || "Normal"}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
