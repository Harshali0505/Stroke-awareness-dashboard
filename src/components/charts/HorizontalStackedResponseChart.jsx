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

const RESPONSE_ORDER = ["Correct", "Uncertain", "Incorrect"];

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return `${Number(value).toFixed(1)}%`;
};

const formatCount = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString();
};

const PercentResponseTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const datum = payload?.[0]?.payload;
  const totalN = datum?.total;

  const rows = payload
    .map((p) => {
      let categoryLabel = p.dataKey;
      if (p.dataKey === "Correct" || p.dataKey === "Incorrect") {
        categoryLabel += " Recognition";
      }

      return {
        key: p.dataKey,
        category: categoryLabel,
        percentValue: p.value,
        countValue: datum?.[`${p.dataKey}__count`],
        color: p.color
      };
    })
    .sort(
      (a, b) =>
        RESPONSE_ORDER.indexOf(a.key) -
        RESPONSE_ORDER.indexOf(b.key)
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

  const transformedData = React.useMemo(() => {
    if (!data) return [];
    return data.map(item => {
      const isHighlighted = highlightLabels.includes(item.name);
      
      return {
        ...item,
        Correct: isHighlighted ? item["No"] : item["Yes"],
        Correct__count: isHighlighted ? item["No__count"] : item["Yes__count"],
        Uncertain: item["Maybe"],
        Uncertain__count: item["Maybe__count"],
        Incorrect: isHighlighted ? item["Yes"] : item["No"],
        Incorrect__count: isHighlighted ? item["Yes__count"] : item["No__count"]
      };
    });
  }, [data, highlightLabels]);

  if (!transformedData || transformedData.length === 0) {
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

  const CustomLegend = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '12px', paddingTop: '10px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#2dd4bf', display: 'inline-block' }}></span>
        <span style={{ color: 'var(--text-primary)' }}>Correct Recognition</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#fbbf24', display: 'inline-block' }}></span>
        <span style={{ color: 'var(--text-primary)' }}>Uncertain</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#f87171', display: 'inline-block' }}></span>
        <span style={{ color: 'var(--text-primary)' }}>Incorrect Recognition</span>
      </div>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={transformedData}
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
          width={280}
          tick={(props) => {
            const { x, y, payload } = props;
            const value = payload.value;
            const isHighlighted = highlightLabels.includes(value);
            const symptomTypeLabel = isHighlighted ? "False Symptom" : "True Symptom";

            return (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={4}
                  textAnchor="end"
                  fill={isHighlighted ? "#f87171" : CHART_COLORS.axis}
                  fontSize={11}
                  fontFamily="Inter, sans-serif"
                  fontWeight={isHighlighted ? 600 : 400}
                >
                  {value}
                </text>
                <text
                  x={0}
                  y={16}
                  dy={4}
                  textAnchor="end"
                  fill={"var(--text-secondary, #64748b)"}
                  fontSize={10}
                  fontFamily="Inter, sans-serif"
                >
                  {symptomTypeLabel}
                </text>
              </g>
            );
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<PercentResponseTooltip />} cursor={{ fill: 'transparent' }} />

        <Legend content={<CustomLegend />} />

        {responseLevels.map((level) => (
          <Bar
            key={level}
            dataKey={level}
            stackId="a"
            fill={
              level === "Correct"
                ? "#2dd4bf"   // teal  – correct/positive
                : level === "Uncertain"
                  ? "#fbbf24" // amber – uncertain
                  : "#f87171" // soft red – no
            }
            hide={hiddenLevels.has(level)}
            opacity={1}
            animationDuration={600}
            radius={level === "Incorrect" ? [0, 4, 4, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalStackedResponseChart;