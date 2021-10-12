import { Box, Typography, useTheme } from "@mui/material";
import { useInterpret } from "@xstate/react";
import { DgameLaunch } from "./DgameLaunch";
import { GlobalStateContext } from "./GlobalStateContext";
import { dgamelaunchMachine } from "./machines/DgameLaunch/dgamelaunchMachine";

const App = () => {
  const theme = useTheme();
  const dgamelaunchService = useInterpret(dgamelaunchMachine);
  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{}}>
          <DgameLaunch />
        </Box>
      </Box>
    </GlobalStateContext.Provider>
  );
};

export default App;
