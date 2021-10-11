import { Button, Paper, Typography } from "@mui/material";
import { useInterpret } from "@xstate/react";
import { DgameLaunch } from "./DgameLaunch";
import { GlobalStateContext } from "./GlobalStateContext";
import { dgamelaunchMachine } from "./machines/dgamelaunchMachine";
import { useSocketIo } from "./useSocketIo";

const App = () => {
  const { connected, emit } = useSocketIo();
  const dgamelaunchService = useInterpret(dgamelaunchMachine);
  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <div className="App">
        <Paper>
          <Typography variant="h1">Do the thing</Typography>
          <DgameLaunch />
        </Paper>
      </div>
    </GlobalStateContext.Provider>
  );
};

export default App;
