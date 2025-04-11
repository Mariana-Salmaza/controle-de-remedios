import Grid from "@mui/material/Grid";
import { GridProps } from "@mui/material/Grid";
import { PropsWithChildren } from "react";

type CustomGridProps = PropsWithChildren<GridProps> & {
  item?: boolean;
  container?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

const CustomGrid = (props: CustomGridProps) => <Grid {...props} />;
export default CustomGrid;
