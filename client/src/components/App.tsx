import {
  AppBar,
  Box,
  Grid,
  ToggleButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
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
    setShowTerminal(false);
  }, []);
  useEffect(() => {
    if (showTerminal) {
    }
  }, [showTerminal]);
  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <ToggleButton
            sx={{ borderRadius: 10, borderStyle: "none" }}
            value="showTerminal"
            selected={showTerminal}
            onChange={() => {
              setShowTerminal(!showTerminal);
            }}
          >
            <ComputerIcon />
          </ToggleButton>
        </Toolbar>
      </AppBar>

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
