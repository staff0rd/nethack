import { Paper, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { useState, useEffect } from "react";

type Props = {
  title: string;
  value: number | string | undefined;
  dontFlash?: boolean;
};

const spin = keyframes`
  from {
    background-color: white;
  }
  to {
    background-color: '#121212';
  }
`;

export const StatusItem = ({ title, value, dontFlash }: Props) => {
  const [flash, setFlash] = useState("");
  useEffect(() => {
    if (!dontFlash) {
      setFlash("");
      setTimeout(() => {
        setFlash(`${spin} 1s ease`);
      }, 10);
    }
  }, [value]);
  return (
    <Paper sx={{ padding: 1, animation: flash }}>
      <Typography sx={{ fontWeight: "bold" }} variant="body1">
        {title}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Paper>
  );
};
