import { useContext } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { GlobalStateContext } from "../GlobalStateContext";
import { useSelector } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { EventTypes, loginMachine } from "../machines/DgameLaunch/loginMachine";

export const Login = () => {
  const theme = useTheme();
  const globalServices = useContext(GlobalStateContext);
  const loginService = useSelector(
    globalServices.dgamelaunchService,
    (state) => state.children.login as ActorRefFrom<typeof loginMachine>
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
        Login
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > :not(style)": { m: 1, width: "250px" },
        }}
      >
        <TextField label="Username" variant="standard" />
        <TextField label="Password" variant="standard" />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          "& > :not(style)": { m: 1 },
        }}
      >
        <Button>Login</Button>
        <Button
          onClick={() => loginService.send({ type: EventTypes.ClickCancel })}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
