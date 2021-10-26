import { Box, IconButton, useTheme } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DotIcon from "@mui/icons-material/FiberManualRecord";
import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import { useContext } from "react";
import { GlobalStateContext } from "../../GlobalStateContext";
import { EventTypes } from "../../machines/DgameLaunch/EventTypes";

/*
 *  y k u   7 8 9   Move commands:
 *   \|/     \|/            yuhjklbn: go one step in specified direction
 *  h-.-l   4-.-6           YUHJKLBN: go in specified direction until you
 *   /|\     /|\                        hit a wall or run into something
 *  b j n   1 2 3           g<dir>:   run in direction <dir> until something
 *        numberpad                     interesting is seen
 *                          G<dir>,   same, except a branching corridor isn't
 *   <  up                  ^<dir>:     considered interesting (the ^ in this
 *                                      case means the Control key, not a caret)
 *   >  down                m<dir>:   move without picking up objects/fighting
 *                          F<dir>:   fight even if you don't sense a monster
 */
export const Movement = () => {
  const theme = useTheme();
  const service = useContext(GlobalStateContext).dgamelaunchService;

  const emit = (key: string) => {
    service.send({ type: EventTypes.SocketEmit, value: key });
  };

  return (
    <Box>
      <Box>
        <IconButton
          onClick={() => emit("y")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
            "& > svg": {
              transform: "rotate(45deg)",
            },
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => emit("k")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
          }}
        >
          <ArrowUpIcon />
        </IconButton>
        <IconButton
          onClick={() => emit("u")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
            "& > svg": {
              transform: "rotate(45deg)",
            },
          }}
        >
          <ArrowUpIcon />
        </IconButton>
      </Box>
      <Box>
        <IconButton
          onClick={() => emit("h")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => emit(".")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
          }}
        >
          <DotIcon />
        </IconButton>
        <IconButton
          onClick={() => emit("l")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
          }}
        >
          <ArrowRightIcon />
        </IconButton>
      </Box>
      <Box>
        <IconButton
          onClick={() => emit("b")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
            "& > svg": {
              transform: "rotate(45deg)",
            },
          }}
        >
          <ArrowDownIcon />
        </IconButton>
        <IconButton
          onClick={() => emit("j")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
          }}
        >
          <ArrowDownIcon />
        </IconButton>
        <IconButton
          onClick={() => emit("n")}
          sx={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.palette.divider,
            "& > svg": {
              transform: "rotate(45deg)",
            },
          }}
        >
          <ArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
