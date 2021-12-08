import { Box, Grid, MenuItem, useTheme } from "@mui/material";
import { DgameLaunch } from "./DgameLaunch";

import { useEffect, useState } from "react";
import { XTerm } from "xterm-for-react";
import { MenuItems, RootMenu } from "./RootMenu";

const App = () => {
  const theme = useTheme();
  const [xterm, setXterm] = useState<XTerm | null>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [shouldConnect, setShouldConnect] = useState(false);

  useEffect(() => {
    setShowTerminal(true);
  }, []);

  const menuItems: MenuItems = [
    (popupState) => (
      <MenuItem
        onClick={() => {
          popupState.close();
          setShouldConnect(!shouldConnect);
        }}
      >
        {`${shouldConnect ? "Disconnect" : "Connect"}`}
      </MenuItem>
    ),
    (popupState) => (
      <MenuItem
        onClick={() => {
          popupState.close();
          setShowTerminal(!showTerminal);
        }}
      >
        {`${showTerminal ? "Hide" : "Show"} Terminal`}
      </MenuItem>
    ),
  ];

  return (
    <>
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
              {xterm && <DgameLaunch xtermRef={xterm} menuItems={menuItems} />}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          sx={{ display: showTerminal ? "flex" : "none", alignItems: "end" }}
        >
          <XTerm ref={(newRef) => setXterm(newRef)} />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
