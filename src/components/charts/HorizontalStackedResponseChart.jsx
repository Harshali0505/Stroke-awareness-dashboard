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
      let cellColor = p.color;
      if (isHighlighted) {
        if (p.dataKey === "Yes") cellColor = "#DC2626"; // Red
        else if (p.dataKey === "No") cellColor = "#16A34A"; // Green
        else if (p.dataKey === "Maybe") cellColor = "#F59E0B"; // Orange
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
      <div style={{ fontWeight: 700, marginBottom: "8px" }}>{label}</div>

      <div style={{ marginBottom: "8px" }}>
        Total N: <strong>{formatCount(totalN)}</strong>
      </div>

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
              backgroundColor: row.color
            }}
          />
          <span style={{ fontWeight: 600 }}>{row.category}</span>
          <span style={{ fontWeight: 700 }}>
            {formatPercent(row.percentValue)}
          </span>

          <span />
          <span style={{ opacity: 0.9 }}>Count</span>
          <span style={{ fontWeight: 600 }}>
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
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />

        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
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
                fill={isHighlighted ? "#B91C1C" : CHART_COLORS.axis}
                fontSize={12}
                fontWeight={isHighlighted ? 500 : 400}
              >
                {value}
              </text>
            );
          }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
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
                ? "#16A34A"
                : level === "Maybe"
                  ? "#F59E0B"
                  : "#DC2626"
            }
            hide={hiddenLevels.has(level)}
            opacity={1}
            animationDuration={700}
          >
            {data.map((entry, index) => {
              const isHighlight = highlightLabels.includes(entry.name);
              let cellColor = level === "Yes" ? "#16A34A" : level === "Maybe" ? "#F59E0B" : "#DC2626";
              if (isHighlight) {
                cellColor = level === "Yes" ? "#DC2626" : level === "Maybe" ? "#F59E0B" : "#16A34A";
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