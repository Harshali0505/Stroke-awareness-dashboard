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
  height = 350,
  barColor = CHART_COLORS.neutral,   // single color for ALL bars in this chart
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
          width={layout === "vertical" ? 220 : 52}
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
          label={layout !== "vertical" ? {
            value: "Percentage",
            angle: -90,
            position: "insideLeft",
            dx: -12,
            style: {
              fill: CHART_COLORS.axis,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              textAnchor: 'middle'
            }
          } : undefined}
        />

        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
        />

        <Bar
          dataKey={valueKey}
          radius={layout === "vertical" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          maxBarSize={layout === "vertical" ? 24 : 52}
        >
          {data.map((entry, index) => {
            const isActive =
              !selectedValue || entry[xKey] === selectedValue;
            return (
              <Cell
                key={index}
                fill={barColor}
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
