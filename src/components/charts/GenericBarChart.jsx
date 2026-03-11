import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
      <BarChart
        data={data}
        layout={layout}
        margin={
          layout === "vertical"
            ? { top: 8, right: 36, left: 8, bottom: 8 }
            : { top: 12, right: 24, left: 0, bottom: 8 }
        }
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke={CHART_COLORS.grid}
          vertical={layout !== "vertical"}
          horizontal={layout === "vertical"}
        />

        <XAxis
          type={layout === "vertical" ? "number" : "category"}
          dataKey={layout === "vertical" ? undefined : xKey}
          stroke="transparent"
          tick={{
            fill: CHART_COLORS.axis,
            fontSize: 11,
            fontFamily: 'Inter, sans-serif'
          }}
          tickLine={false}
          axisLine={false}
          interval={0}
          tickFormatter={layout === "vertical" ? (v) => `${v}%` : formatTick}
        />

        <YAxis
          type={layout === "vertical" ? "category" : "number"}
          dataKey={layout === "vertical" ? xKey : undefined}
          stroke="transparent"
          width={layout === "vertical" ? 190 : 48}
          tick={{
            fill: CHART_COLORS.axis,
            fontSize: 11,
            fontFamily: 'Inter, sans-serif',
            textAnchor: layout === "vertical" ? 'end' : 'middle'
          }}
          tickLine={false}
          axisLine={false}
          interval={0}
          tickFormatter={layout === "vertical" ? formatTick : undefined}
        />

        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
        />

        <Bar
          dataKey={valueKey}
          radius={layout === "vertical" ? [0, 6, 6, 0] : [6, 6, 0, 0]}
          maxBarSize={layout === "vertical" ? 22 : 40}
        >
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
