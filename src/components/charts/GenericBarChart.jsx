import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ResponsiveContainer
} from "recharts";
import { CHART_COLORS } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const GenericBarChart = ({
  data = [],
  xKey = "label",
  valueKey = "percentage",
  selectedValue = null,
  onSelect = null,
  layout = "horizontal",
  height = 350
}) => {
  const formatTick = (tick) => {
    if (typeof tick === 'string') {
      return tick.replace(/_/g, ' ');
    }
    return tick;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          type={layout === "vertical" ? "number" : "category"}
          dataKey={layout === "vertical" ? undefined : xKey}
          stroke={CHART_COLORS.axis}
          interval={0}
          tickFormatter={layout === "vertical" ? undefined : formatTick}
        />
        <YAxis
          type={layout === "vertical" ? "category" : "number"}
          dataKey={layout === "vertical" ? xKey : undefined}
          stroke={CHART_COLORS.axis}
          width={layout === "vertical" ? 180 : 60}
          tick={layout === "vertical" ? { fontSize: 13, textAnchor: 'end' } : { fontSize: 13 }}
          interval={0}
          tickFormatter={layout === "vertical" ? formatTick : undefined}
        />
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
                cursor={onSelect ? "pointer" : "default"}
                onClick={() => onSelect && onSelect(entry[xKey])}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GenericBarChart;

