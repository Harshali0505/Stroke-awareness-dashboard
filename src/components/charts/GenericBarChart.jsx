import React from "react";
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

const toLabelString = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.replace(/_/g, " ");
  return String(value);
};

const truncateLabel = (value, maxChars) => {
  const s = toLabelString(value);
  if (!maxChars || maxChars <= 0) return "";
  if (s.length <= maxChars) return s;
  return `${s.slice(0, Math.max(1, maxChars - 1))}…`;
};

const XAxisTick = ({ x, y, payload, angle = 0, maxChars = 14 }) => {
  const full = toLabelString(payload?.value);
  const display = truncateLabel(payload?.value, maxChars);

  const anchor = angle < 0 ? "end" : "middle";

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor={anchor}
        fill={CHART_COLORS.axis}
        fontSize={11}
        fontFamily="Inter, sans-serif"
        transform={angle ? `rotate(${angle})` : undefined}
      >
        <title>{full}</title>
        {display}
      </text>
    </g>
  );
};

const GenericBarChart = ({
  data = [],
  xKey = "label",
  valueKey = "percentage",
  selectedValue = null,
  onSelect = null,
  layout = "horizontal",
  height = 350,
  barColor = CHART_COLORS.neutral,
  showHoverHint = true,
}) => {
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isVerticalLayout = layout === "vertical";

  const categoryCount = Array.isArray(data) ? data.length : 0;
  const approxChartWidth = Math.max(320, viewportWidth - 360);
  const approxLabelSlot = categoryCount > 0 ? approxChartWidth / categoryCount : approxChartWidth;

  const areLabelsNumeric = React.useMemo(() => {
    if (isVerticalLayout || !Array.isArray(data) || data.length === 0) return false;
    return data.every((d) => {
      const v = d?.[xKey];
      const s = typeof v === 'string' ? v.trim() : String(v ?? '').trim();
      return s !== '' && /^\d+$/.test(s);
    });
  }, [data, xKey, isVerticalLayout]);

  const shouldRotate =
    !isVerticalLayout &&
    !areLabelsNumeric &&
    (approxLabelSlot < 70 || categoryCount >= 10);
  const tickAngle = shouldRotate ? -35 : 0;

  const maxChars = !isVerticalLayout
    ? approxLabelSlot < 55
      ? 6
      : approxLabelSlot < 75
        ? 9
        : approxLabelSlot < 100
          ? 12
          : 18
    : 18;

  const xAxisHeight = !isVerticalLayout ? (shouldRotate ? 62 : 36) : 32;

  const margin = isVerticalLayout
    ? { top: 8, right: 36, left: 8, bottom: 8 }
    : { top: 12, right: 24, left: 0, bottom: shouldRotate ? 22 : 8 };

  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={margin}
          barCategoryGap="30%"
        >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke={CHART_COLORS.grid}
                vertical={!isVerticalLayout}
                horizontal={isVerticalLayout}
              />

              <XAxis
                type={isVerticalLayout ? "number" : "category"}
                dataKey={isVerticalLayout ? undefined : xKey}
                stroke="transparent"
                tickLine={false}
                axisLine={false}
                interval={0}
                height={xAxisHeight}
                tick={
                  isVerticalLayout
                    ? {
                        fill: CHART_COLORS.axis,
                        fontSize: 11,
                        fontFamily: "Inter, sans-serif"
                      }
                    : (props) => (
                        <XAxisTick
                          {...props}
                          angle={tickAngle}
                          maxChars={maxChars}
                        />
                      )
                }
                tickFormatter={isVerticalLayout ? (v) => `${v}%` : undefined}
              />

              <YAxis
                type={isVerticalLayout ? "category" : "number"}
                dataKey={isVerticalLayout ? xKey : undefined}
                stroke="transparent"
                width={isVerticalLayout ? 220 : 52}
                tick={{
                  fill: CHART_COLORS.axis,
                  fontSize: 11,
                  fontFamily: "Inter, sans-serif",
                  textAnchor: isVerticalLayout ? "end" : "middle"
                }}
                tickLine={false}
                axisLine={false}
                interval={0}
                tickFormatter={isVerticalLayout ? toLabelString : undefined}
                label={
                  !isVerticalLayout
                    ? {
                        value: "Percentage",
                        angle: -90,
                        position: "insideLeft",
                        dx: -12,
                        style: {
                          fill: CHART_COLORS.axis,
                          fontSize: 11,
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          textAnchor: "middle"
                        }
                      }
                    : undefined
                }
              />

              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
              />

              <Bar
                dataKey={valueKey}
                radius={isVerticalLayout ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                maxBarSize={isVerticalLayout ? 24 : 52}
              >
                {data.map((entry, index) => {
                  const isActive = !selectedValue || entry[xKey] === selectedValue;
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

      {showHoverHint && (
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "11px",
            color: "var(--text-tertiary, #94a3b8)",
            textAlign: "center",
            lineHeight: 1.4
          }}
        >
          Hover over a category to see participant count and share.
        </p>
      )}
    </div>
  );
};

export default GenericBarChart;
