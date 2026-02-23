import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { getAwarenessColor, CHART_COLORS } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const _AWARENESS_ORDER = ["Low Awareness", "Moderate Awareness", "High Awareness"];

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return `${Number(value).toFixed(1)}%`;
};

const formatCount = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString();
};

const PercentAwarenessTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const datum = payload?.[0]?.payload;
  const totalN = datum?.total;

  const rows = payload
    .map((p) => {
      const category = p?.dataKey;
      if (!category) return null;
      return {
        key: String(category),
        category,
        percentValue: p?.value,
        countValue: datum?.[`${category}__count`],
        color: p?.color
      };
    })
    .filter(Boolean)
    .sort((a, b) => _AWARENESS_ORDER.indexOf(a.category) - _AWARENESS_ORDER.indexOf(b.category));

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${CHART_COLORS.grid}`,
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "13px",
        color: CHART_COLORS.axis,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        minWidth: "220px"
      }}
    >
      {label && (
        <div style={{ fontWeight: 700, marginBottom: "8px" }}>
          {label}
        </div>
      )}

      {totalN !== undefined && (
        <div style={{ marginBottom: "8px" }}>
          Total N: <strong>{formatCount(totalN)}</strong>
        </div>
      )}

      {rows.map((row) => (
        <div
          key={row.key}
          style={{
            display: "grid",
            gridTemplateColumns: "12px 1fr auto",
            columnGap: "8px",
            alignItems: "start",
            marginTop: "6px"
          }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "2px",
              marginTop: "3px",
              backgroundColor: row.color || getAwarenessColor(row.category)
            }}
          />
          <span style={{ fontWeight: 600 }}>{row.category}</span>
          <span style={{ fontWeight: 700 }}>{formatPercent(row.percentValue)}</span>

          <span />
          <span style={{ opacity: 0.9 }}>Count</span>
          <span style={{ fontWeight: 600 }}>{formatCount(row.countValue)} participants</span>
        </div>
      ))}
    </div>
  );
};

const StackedAwarenessChart = ({
  data = [],
  title,
  height = 400,
  barSize = 18,
  widthScaling = 'standard',
  valueMode = 'count',
  selectedCategory = null,
  onSelectCategory = null
}) => {
  const [hiddenLevels, setHiddenLevels] = React.useState(() => new Set());

  const resetHiddenLevels = React.useCallback(() => {
    setHiddenLevels(new Set());
  }, []);

  // Extract awareness levels dynamically
  const awarenessLevels = React.useMemo(() => {
    const present = new Set();
    data.forEach((item) => {
      _AWARENESS_ORDER.forEach((level) => {
        if (item && Object.prototype.hasOwnProperty.call(item, level)) {
          present.add(level);
        }
      });
    });

    return _AWARENESS_ORDER.filter((l) => present.has(l));
  }, [data]);

  const effectiveBarSize = React.useMemo(() => {
    const groupCount = Array.isArray(data) ? data.length : 0;
    const visibleLevels = awarenessLevels.filter((l) => !hiddenLevels.has(l));
    const total = awarenessLevels.length || 1;
    const visible = visibleLevels.length || 1;

    // Fewer X-axis groups => make bars thicker so the chart doesn't look skinny.
    const groupScale =
      widthScaling === 'adaptive'
        ? groupCount <= 2
          ? 1.9
          : groupCount <= 3
            ? 1.7
            : groupCount <= 5
              ? 1.35
              : groupCount <= 8
                ? 1.15
                : groupCount >= 14
                  ? 0.9
                  : 1
        : 1;

    // If the user hides series via legend, scale bars up so the chart stays readable.
    // Example: 3 series -> 1 visible => bar size ~3x (capped).
    const scale = total / visible;
    return Math.min(44, Math.round(barSize * groupScale * scale));
  }, [data, awarenessLevels, hiddenLevels, barSize, widthScaling]);

  const spacing = React.useMemo(() => {
    const groupCount = Array.isArray(data) ? data.length : 0;
    if (widthScaling !== 'adaptive') {
      return { barCategoryGap: '20%', barGap: 4 };
    }
    if (groupCount <= 3) {
      return { barCategoryGap: '10%', barGap: 8 };
    }
    if (groupCount <= 6) {
      return { barCategoryGap: '14%', barGap: 6 };
    }
    if (groupCount <= 10) {
      return { barCategoryGap: '18%', barGap: 4 };
    }
    return { barCategoryGap: '24%', barGap: 3 };
  }, [data, widthScaling]);

  React.useEffect(() => {
    setHiddenLevels((prev) => {
      const next = new Set();
      awarenessLevels.forEach((l) => {
        if (prev.has(l)) next.add(l);
      });
      return next;
    });
  }, [awarenessLevels]);

  // No data guard
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: CHART_COLORS.axis,
          fontSize: "16px"
        }}
      >
        No data available to display
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {title && (
        <h3
          style={{
            color: CHART_COLORS.axis,
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "16px",
            textAlign: "center"
          }}
        >
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          barCategoryGap={spacing.barCategoryGap}
          barGap={spacing.barGap}
          maxBarSize={44}
          margin={{ top: 10, right: 18, left: 10, bottom: 18 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            vertical={false}
          />

          <XAxis
            dataKey="name"
            interval={0}
            height={42}
            tick={{
              fill: CHART_COLORS.axis,
              fontSize: 12
            }}
            tickMargin={10}
            tickFormatter={(value) => {
              const s = String(value ?? "");
              return s.length > 14 ? `${s.slice(0, 14)}…` : s;
            }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={{ stroke: CHART_COLORS.grid }}
          />

          <YAxis
            domain={valueMode === 'percent' ? [0, 100] : undefined}
            tick={{
              fill: CHART_COLORS.axis,
              fontSize: 12
            }}
            tickFormatter={valueMode === 'percent' ? (value) => `${value}%` : undefined}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={{ stroke: CHART_COLORS.grid }}
            label={{
              value: valueMode === 'percent' ? "Percentage" : "Participants",
              angle: -90,
              position: "insideLeft",
              style: {
                fill: CHART_COLORS.axis,
                fontSize: 12,
                fontWeight: 600
              }
            }}
          />

          {/* Shared reusable tooltip */}
          <Tooltip
            content={
              valueMode === 'percent' ? (
                <PercentAwarenessTooltip />
              ) : (
                <ChartTooltip />
              )
            }
          />

          <Legend
            wrapperStyle={{ paddingTop: "10px", fontSize: "12px", lineHeight: 1.2 }}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;

              const showReset = hiddenLevels.size > 0;

              return (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "8px",
                    color: CHART_COLORS.axis
                  }}
                >
                  {payload.map((entry) => {
                    const value = entry?.value;
                    const isHidden = value ? hiddenLevels.has(value) : false;
                    return (
                      <button
                        key={String(value)}
                        type="button"
                        onClick={() => {
                          if (!value) return;
                          setHiddenLevels((prev) => {
                            const next = new Set(prev);
                            if (next.has(value)) next.delete(value);
                            else next.add(value);
                            return next;
                          });
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          border: "none",
                          background: "transparent",
                          padding: 0,
                          cursor: "pointer",
                          color: CHART_COLORS.axis,
                          fontSize: "12px",
                          opacity: isHidden ? 0.45 : 1
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            backgroundColor: getAwarenessColor(value),
                            borderRadius: "2px"
                          }}
                        />
                        <span>{value}</span>
                      </button>
                    );
                  })}

                  {showReset && (
                    <button
                      type="button"
                      onClick={resetHiddenLevels}
                      style={{
                        marginLeft: "auto",
                        border: `1px solid ${CHART_COLORS.grid}`,
                        background: "transparent",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: CHART_COLORS.axis
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              );
            }}
          />

          {/* Grouped bars */}
          {awarenessLevels.map(level => {
            return (
              <Bar
                key={level}
                dataKey={level}
                fill={getAwarenessColor(level)}
                barSize={effectiveBarSize}
                hide={hiddenLevels.has(level)}
                opacity={1}
                cursor="pointer"
                onClick={() =>
                  onSelectCategory && onSelectCategory(level)
                }
                animationDuration={700}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAwarenessChart;
