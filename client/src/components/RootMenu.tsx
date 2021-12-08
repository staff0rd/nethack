import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

export type MenuItems = {
  onClick: React.MouseEventHandler<HTMLLIElement>;
  text: string;
  shouldClose?: boolean;
}[];

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
            {items.map((item, index) => (
              <MenuItem
                key={index}
                onClick={(e) => {
                  item.shouldClose && popupState.close();
                  item.onClick(e);
                }}
              >
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};
