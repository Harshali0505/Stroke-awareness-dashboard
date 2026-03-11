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

const PercentAwarenessTooltip = ({ active, payload, label, isolatedLevel, totalIsolated }) => {
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
        background: 'var(--tooltip-bg, #ffffff)',
        border: '1px solid var(--tooltip-border, rgba(148,163,184,0.25))',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary, #0f172a)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        minWidth: '220px',
        pointerEvents: 'none'
      }}
    >
      {label && (
        <div style={{
          fontWeight: 700,
          marginBottom: '8px',
          paddingBottom: '6px',
          borderBottom: '1px solid var(--border, rgba(148,163,184,0.15))'
        }}>
          {label}
        </div>
      )}

      {isolatedLevel && totalIsolated !== undefined && totalIsolated !== null ? (
        <div style={{ marginBottom: '8px', color: 'var(--text-secondary, #64748b)', fontSize: '11px' }}>
          Share of total {isolatedLevel} ({formatCount(totalIsolated)})
        </div>
      ) : totalN !== undefined && (
        <div style={{ marginBottom: '8px', color: 'var(--text-secondary, #64748b)', fontSize: '11px' }}>
          Total N: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{formatCount(totalN)}</strong>
        </div>
      )}

      {rows.map((row) => (
        <div
          key={row.key}
          style={{
            display: 'grid',
            gridTemplateColumns: '10px 1fr auto',
            columnGap: '8px',
            alignItems: 'start',
            marginTop: '6px'
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              marginTop: '3px',
              backgroundColor: row.color || getAwarenessColor(row.category)
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{row.category}</span>
          <span style={{ fontWeight: 700, color: 'var(--brand-primary, #0f766e)' }}>{formatPercent(row.percentValue)}</span>

          <span />
          <span style={{ opacity: 0.7, fontSize: '11px', color: 'var(--text-secondary, #64748b)' }}>Count</span>
          <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary, #64748b)' }}>{formatCount(row.countValue)} participants</span>
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

  const isolatedLevel = React.useMemo(() => {
    if (hiddenLevels.size === awarenessLevels.length - 1 && awarenessLevels.length > 1) {
      return awarenessLevels.find(l => !hiddenLevels.has(l));
    }
    return null;
  }, [hiddenLevels, awarenessLevels]);

  const displayData = React.useMemo(() => {
    if (!isolatedLevel || valueMode !== 'percent') return data;

    // If we're isolating a specific column, its percentages should be relative to
    // the sum of that column across all demographics in the current chart.
    const totalIsolatedCount = data.reduce((sum, item) => sum + (item[`${isolatedLevel}__count`] || 0), 0);

    return data.map(item => {
      const count = item[`${isolatedLevel}__count`] || 0;
      const pct = totalIsolatedCount > 0 ? (count / totalIsolatedCount) * 100 : 0;
      return {
        ...item,
        [isolatedLevel]: pct
      };
    });
  }, [data, isolatedLevel, valueMode]);

  const totalIsolated = React.useMemo(() => {
    if (!isolatedLevel || valueMode !== 'percent') return null;
    return data.reduce((sum, item) => sum + (item[`${isolatedLevel}__count`] || 0), 0);
  }, [data, isolatedLevel, valueMode]);

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
          data={displayData}
          barCategoryGap={spacing.barCategoryGap}
          barGap={spacing.barGap}
          maxBarSize={44}
          margin={{ top: 10, right: 18, left: 10, bottom: 18 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={CHART_COLORS.grid}
            vertical={false}
          />

          <XAxis
            dataKey="name"
            interval={0}
            height={42}
            tick={{
              fill: CHART_COLORS.axis,
              fontSize: 11,
              fontFamily: 'Inter, sans-serif'
            }}
            tickMargin={10}
            tickFormatter={(value) => {
              const s = String(value ?? "");
              return s.length > 14 ? `${s.slice(0, 14)}…` : s;
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={valueMode === 'percent' ? [0, 100] : undefined}
            tick={{
              fill: CHART_COLORS.axis,
              fontSize: 11,
              fontFamily: 'Inter, sans-serif'
            }}
            tickFormatter={valueMode === 'percent' ? (value) => `${value}%` : undefined}
            axisLine={false}
            tickLine={false}
            width={44}
            label={{
              value: valueMode === 'percent' ? "Percentage" : "Participants",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: {
                fill: CHART_COLORS.axis,
                fontSize: 11,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }
            }}
          />

          {/* Shared reusable tooltip */}
          <Tooltip
            content={
              valueMode === 'percent' ? (
                <PercentAwarenessTooltip isolatedLevel={isolatedLevel} totalIsolated={totalIsolated} />
              ) : (
                <ChartTooltip />
              )
            }
          />

          <Legend
            wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;

              const showReset = hiddenLevels.size > 0;

              return (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {payload.map((entry) => {
                    const value = entry?.value;
                    const isHidden = value ? hiddenLevels.has(value) : false;
                    const color = getAwarenessColor(value);
                    return (
                      <button
                        key={String(value)}
                        type="button"
                        onClick={() => {
                          if (!value) return;
                          setHiddenLevels((prev) => {
                            const isIsolated = prev.size === awarenessLevels.length - 1 && !prev.has(value);
                            if (isIsolated) {
                              return new Set();
                            } else {
                              const next = new Set(awarenessLevels);
                              next.delete(value);
                              return next;
                            }
                          });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          border: `1px solid ${isHidden ? 'rgba(148,163,184,0.2)' : color + '40'}`,
                          background: isHidden ? 'transparent' : color + '15',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          color: isHidden ? 'var(--text-tertiary, #94a3b8)' : 'var(--text-secondary, #64748b)',
                          fontSize: '11px',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: isHidden ? 400 : 500,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            backgroundColor: isHidden ? 'rgba(148,163,184,0.4)' : color,
                            borderRadius: '50%',
                            flexShrink: 0
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
                        marginLeft: '8px',
                        border: '1px solid var(--border, rgba(148,163,184,0.25))',
                        background: 'transparent',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'Inter, sans-serif',
                        color: 'var(--text-tertiary, #94a3b8)',
                        transition: 'all 0.2s ease'
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
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={() =>
                  onSelectCategory && onSelectCategory(level)
                }
                animationDuration={600}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAwarenessChart;
