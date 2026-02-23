import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from "recharts";
import { CHART_COLORS } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const GenericBarChart = ({
  data = [],
  xKey = "label",
  valueKey = "percentage",
  selectedValue = null,
  onSelect = null,
  width = 700,
  height = 350
}) => {
  return (
    <BarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
      <XAxis dataKey={xKey} stroke={CHART_COLORS.axis} />
      <YAxis stroke={CHART_COLORS.axis} />
      <Tooltip content={<ChartTooltip />} />
      <Legend />

      <Bar dataKey={valueKey}>
        {data.map((entry, index) => {
          const isActive =
            !selectedValue || entry[xKey] === selectedValue;

          return (
            <Cell
              key={index}
              fill={CHART_COLORS.neutral}
              opacity={isActive ? 1 : CHART_COLORS.inactiveOpacity}
              cursor="pointer"
              onClick={() => onSelect && onSelect(entry[xKey])}
            />
          );
        })}
      </Bar>
    </BarChart>
  );
};

export default GenericBarChart;
