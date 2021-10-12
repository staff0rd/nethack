import { useContext } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { GlobalStateContext } from "../GlobalStateContext";
import { useSelector } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import {
  EventTypes,
  registerMachine,
} from "../machines/DgameLaunch/registerMachine";

export const Register = () => {
  const theme = useTheme();
  const globalServices = useContext(GlobalStateContext);
  const registerService = useSelector(
    globalServices.dgamelaunchService,
    (state) => state.children.register as ActorRefFrom<typeof registerMachine>
  );

  return (
    <Box
      component="form"
      sx={{
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderRadius: 1,
        borderWidth: 1,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        variant="h3"
        sx={{ marginLeft: 1, color: theme.palette.text.primary }}
      >
        Register
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > :not(style)": { m: 1, width: "250px" },
        }}
      >
        <TextField
          label="Username"
          variant="standard"
          inputProps={{
            maxLength: 20,
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="standard"
          inputProps={{
            maxLength: 10,
          }}
        />
        <TextField
          label="Password (again)"
          type="password"
          variant="standard"
          inputProps={{
            maxLength: 10,
          }}
        />
        <TextField
          label="Email"
          variant="standard"
          inputProps={{
            maxLength: 80,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          "& > :not(style)": { m: 1 },
        }}
      >
        <Button>Register</Button>
        <Button
          onClick={() => registerService.send({ type: EventTypes.ClickCancel })}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
