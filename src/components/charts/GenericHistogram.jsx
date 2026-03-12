import React from "react";
import {
  ComposedChart,
  Bar,
  Cell,
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
  height = 350,
  barColor = CHART_COLORS.neutral,
  showHoverHint = true,
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
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={trendData || data}
          margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
        >
        <CartesianGrid strokeDasharray="4 4" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke="transparent"
          tick={{ fill: CHART_COLORS.axis, fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const n = Number(v);
            return Number.isFinite(n) ? String(Math.round(n)) : v;
          }}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: CHART_COLORS.axis, fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
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
                      fontSize: 11,
                      fontFamily: 'Inter, sans-serif'
                    }
                    : undefined
                }
              />
            ))}

        <Bar dataKey={valueKey} radius={[3, 3, 0, 0]} maxBarSize={48}>
          {Array.isArray(data) && data.map((_, index) => (
            <Cell
              key={index}
              fill={barColor}
            />
          ))}
        </Bar>
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

export default GenericHistogram;
