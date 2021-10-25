import { Box, Grid, ToggleButton, useTheme } from "@mui/material";
import { useInterpret } from "@xstate/react";
import { DgameLaunch } from "./DgameLaunch";
import { GlobalStateContext } from "../GlobalStateContext";
import { dgamelaunchMachine } from "../machines/DgameLaunch/dgamelaunchMachine";
import ComputerIcon from "@mui/icons-material/Computer";
import { useEffect, useState, useRef } from "react";
import { XTerm } from "xterm-for-react";

const App = () => {
  const theme = useTheme();
  const xtermRef = useRef<XTerm>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const dgamelaunchService = useInterpret(
    dgamelaunchMachine.withContext({ xterm: xtermRef })
  );
  useEffect(() => {
    setShowTerminal(true);
  }, []);
  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <ToggleButton
        sx={{
          borderRadius: 10,
          borderStyle: "none",
          position: "fixed",
          margin: 1,
          right: 0,
        }}
        value="showTerminal"
        selected={showTerminal}
        onChange={() => {
          setShowTerminal(!showTerminal);
        }}
      >
        <ComputerIcon />
      </ToggleButton>

      <Grid
        container
        sx={{
          backgroundColor: theme.palette.background.default,
          width: "100%",
          height: "100%",
        }}
      >
        <Grid item sx={{ flexGrow: 1 }}>
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
            <Box>
              <DgameLaunch />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          sx={{ display: showTerminal ? "flex" : "none", alignItems: "end" }}
        >
          <XTerm ref={xtermRef} />
        </Grid>
      </Grid>
    </GlobalStateContext.Provider>
  );
};

export default App;
