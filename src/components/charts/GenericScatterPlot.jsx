import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { CHART_COLORS } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const GenericScatterPlot = ({
  data,
  xKey,
  yKey,
  width = 700,
  height = 400
}) => {
  return (
    <ScatterChart width={width} height={height}>
      <CartesianGrid stroke={CHART_COLORS.grid} />
      <XAxis dataKey={xKey} stroke={CHART_COLORS.axis} />
      <YAxis dataKey={yKey} stroke={CHART_COLORS.axis} />
      <Tooltip content={<ChartTooltip />} />
      <Scatter data={data} fill={CHART_COLORS.primary} />
    </ScatterChart>
  );
};

export default GenericScatterPlot;
