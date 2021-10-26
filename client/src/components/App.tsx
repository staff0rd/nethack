import * as React from "react";
import { Box, Button, Grid, Menu, MenuItem, useTheme } from "@mui/material";
import { useInterpret } from "@xstate/react";
import { DgameLaunch } from "./DgameLaunch";
import { GlobalStateContext } from "../GlobalStateContext";
import { dgamelaunchMachine } from "../machines/DgameLaunch";
import { EventTypes } from "../machines/DgameLaunch/EventTypes";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState, useRef } from "react";
import { XTerm } from "xterm-for-react";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

const App = () => {
  const theme = useTheme();
  const xtermRef = useRef<XTerm>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const dgamelaunchService = useInterpret(
    dgamelaunchMachine.withContext({ xterm: xtermRef, isPlaying: false })
  );
  useEffect(() => {
    setShowTerminal(true);
  }, []);
  return (
    <GlobalStateContext.Provider value={{ dgamelaunchService }}>
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Button
              sx={{
                borderRadius: 10,
                borderStyle: "none",
                position: "fixed",
                margin: 1,
                right: 0,
                "&.MuiButton-root": {
                  minWidth: 0,
                },
              }}
              {...bindTrigger(popupState)}
            >
              <MenuIcon />
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem
                onClick={() => {
                  popupState.close();
                  setShowTerminal(!showTerminal);
                }}
              >
                {`${showTerminal ? "Hide" : "Show"} Terminal`}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dgamelaunchService.send(EventTypes.PrintParser);
                  popupState.close();
                }}
              >
                Print Terminal
              </MenuItem>
              <MenuItem onClick={popupState.close}>Logout</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>

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
