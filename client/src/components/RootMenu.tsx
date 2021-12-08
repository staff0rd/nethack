import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactNode } from "react";
import PopupState, {
  bindTrigger,
  bindMenu,
  InjectedProps,
} from "material-ui-popup-state";

export type MenuItems =
  | ((popupState: InjectedProps) => ReactNode)[]
  | ((popupState: InjectedProps) => ReactNode);

type Props = {
  items: MenuItems;
};

export const RootMenu = ({ items }: Props) => {
  return (
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
              top: 0,
              "&.MuiButton-root": {
                minWidth: 0,
              },
            }}
            {...bindTrigger(popupState)}
          >
            <MenuIcon />
          </Button>
          <Menu {...bindMenu(popupState)}>
            {Array.isArray(items)
              ? items.map((c) => React.Children.toArray(c(popupState)))
              : items(popupState)}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};
