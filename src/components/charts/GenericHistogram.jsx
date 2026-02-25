import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { CHART_COLORS } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const GenericHistogram = ({
  data,
  xKey,
  valueKey = "count",
  referenceLines = [],
  showTrendLine = true,
  height = 350
}) => {
  const trendData = React.useMemo(() => {
    if (!showTrendLine || !Array.isArray(data)) return null;
    const windowSize = 3;
    return data.map((d, i) => {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
      const slice = data.slice(start, end);
      const avg = slice.reduce((sum, row) => sum + Number(row?.[valueKey] ?? 0), 0) / slice.length;
      return { ...d, __trend: avg };
    });
  }, [data, showTrendLine, valueKey]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={trendData || data}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey={xKey}
          stroke={CHART_COLORS.axis}
          tickFormatter={(v) => {
            const n = Number(v);
            return Number.isFinite(n) ? String(Math.round(n)) : v;
          }}
        />
        <YAxis stroke={CHART_COLORS.axis} />
        <Tooltip content={<ChartTooltip />} />
        {Array.isArray(referenceLines) &&
          referenceLines
            .filter((l) => l && typeof l.x === "number")
            .map((l) => (
              <ReferenceLine
                key={l.key || `${l.label || "ref"}-${l.x}`}
                x={l.x}
                stroke={l.color || CHART_COLORS.axis}
                strokeDasharray={l.strokeDasharray || "4 4"}
                label={
                  l.label
                    ? {
                      value: l.label,
                      fill: l.color || CHART_COLORS.axis,
                      position: "top",
                      fontSize: 12
                    }
                    : undefined
                }
              />
            ))}

        <Bar dataKey={valueKey} fill={CHART_COLORS.neutral} />
        {showTrendLine && (
          <Line
            type="monotone"
            dataKey="__trend"
            stroke={CHART_COLORS.high}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default GenericHistogram;
