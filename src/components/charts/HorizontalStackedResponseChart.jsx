import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { CHART_COLORS } from "../../constants/colors";

const RESPONSE_ORDER = ["Yes", "Maybe", "No"];

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return `${Number(value).toFixed(1)}%`;
};

const formatCount = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString();
};

const PercentResponseTooltip = ({ active, payload, label, highlightLabels = [] }) => {
  if (!active || !payload || payload.length === 0) return null;

  const datum = payload?.[0]?.payload;
  const totalN = datum?.total;
  const isHighlighted = highlightLabels.includes(datum?.name);

  const rows = payload
    .map((p) => {
      // Highlighted rows flip colors: Yes = red (wrong to go to hospital?), No = teal (correct: no symptoms)
      let cellColor = p.color;
      if (isHighlighted) {
        if (p.dataKey === "Yes") cellColor = "#f87171";   // soft red
        else if (p.dataKey === "No") cellColor = "#2dd4bf";  // teal
        else if (p.dataKey === "Maybe") cellColor = "#fbbf24"; // amber
      }
      return {
        key: p.dataKey,
        category: p.dataKey,
        percentValue: p.value,
        countValue: datum?.[`${p.dataKey}__count`],
        color: cellColor
      };
    })
    .sort(
      (a, b) =>
        RESPONSE_ORDER.indexOf(a.category) -
        RESPONSE_ORDER.indexOf(b.category)
    );

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
      <div style={{
        fontWeight: 700,
        marginBottom: '8px',
        paddingBottom: '6px',
        borderBottom: '1px solid var(--border, rgba(148,163,184,0.15))'
      }}>{label}</div>

      <div style={{ marginBottom: '8px', color: 'var(--text-secondary, #64748b)', fontSize: '11px' }}>
        Total N: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{formatCount(totalN)}</strong>
      </div>

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
              backgroundColor: row.color
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{row.category}</span>
          <span style={{ fontWeight: 700, color: 'var(--brand-primary, #0f766e)' }}>
            {formatPercent(row.percentValue)}
          </span>

          <span />
          <span style={{ opacity: 0.7, fontSize: '11px', color: 'var(--text-secondary, #64748b)' }}>Count</span>
          <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary, #64748b)' }}>
            {formatCount(row.countValue)} participants
          </span>
        </div>
      ))}
    </div>
  );
};

const HorizontalStackedResponseChart = ({
  data = [],
  height = 420,
  highlightLabels = []
}) => {
  const [hiddenLevels, setHiddenLevels] = React.useState(() => new Set());

  const responseLevels = RESPONSE_ORDER;

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
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 18, left: 120, bottom: 18 }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />

        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: CHART_COLORS.axis, fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          tickFormatter={(value) => `${value}%`}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="category"
          dataKey="name"
          width={260}
          tick={(props) => {
            const { x, y, payload } = props;
            const value = payload.value;
            const isHighlighted = highlightLabels.includes(value);

            return (
              <text
                x={x}
                y={y}
                dy={4}
                textAnchor="end"
                fill={isHighlighted ? "#f87171" : CHART_COLORS.axis}
                fontSize={11}
                fontFamily="Inter, sans-serif"
                fontWeight={isHighlighted ? 600 : 400}
              >
                {value}
              </text>
            );
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<PercentResponseTooltip highlightLabels={highlightLabels} />} />

        <Legend
          wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
          onClick={(e) => {
            const value = e?.value;
            setHiddenLevels((prev) => {
              const responseLevels = ["Yes", "Maybe", "No"];
              const isIsolated = prev.size === responseLevels.length - 1 && !prev.has(value);
              if (isIsolated) {
                return new Set();
              } else {
                const next = new Set(responseLevels);
                next.delete(value);
                return next;
              }
            });
          }}
        />

        {responseLevels.map((level) => (
          <Bar
            key={level}
            dataKey={level}
            stackId="a"
            fill={
              level === "Yes"
                ? "#2dd4bf"   // teal  – correct/positive
                : level === "Maybe"
                  ? "#fbbf24" // amber – uncertain
                  : "#f87171" // soft red – no
            }
            hide={hiddenLevels.has(level)}
            opacity={1}
            animationDuration={600}
            radius={level === "No" ? [0, 4, 4, 0] : [0, 0, 0, 0]}
          >
            {data.map((entry, index) => {
              const isHighlight = highlightLabels.includes(entry.name);
              let cellColor = level === "Yes" ? "#2dd4bf" : level === "Maybe" ? "#fbbf24" : "#f87171";
              if (isHighlight) {
                // Flipped: for highlighted "wrong" symptom
                cellColor = level === "Yes" ? "#f87171" : level === "Maybe" ? "#fbbf24" : "#2dd4bf";
              }
              return <Cell key={`cell-${index}`} fill={cellColor} />;
            })}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalStackedResponseChart;