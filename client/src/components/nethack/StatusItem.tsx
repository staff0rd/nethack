import { Paper, Typography } from "@mui/material";

type Props = {
  title: string;
  value: number | string | undefined;
};

export const StatusItem = ({ title, value }: Props) => {
  return (
    <Paper sx={{ padding: 1 }}>
      <Typography sx={{ fontWeight: "bold" }} variant="body1">
        {title}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Paper>
  );
};
