import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAwarenessColor } from "../../constants/colors";

// Simple label rendered directly on slice
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Don't render label if slice is too small
  if (percent < 0.04) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '13px', fontWeight: 700, fontFamily: "'Inter', sans-serif", pointerEvents: 'none' }}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontWeight: 700, color: entry.payload.fill || entry.color, fontSize: '13px', marginBottom: '2px' }}>
        {entry.name}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
        {entry.value}%
      </div>
    </div>
  );
};

const GenericPieChart = ({
  data,
  labelKey = "label",
  valueKey = "percentage",
  height = 360,
  innerRadius = "60%",
  colors = null
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={labelKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius="80%"
          stroke="var(--bg-surface)"
          strokeWidth={3}
          label={innerRadius === 0 ? renderLabel : false}
          labelLine={false}
        >
          {data && data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors ? colors[index % colors.length] : getAwarenessColor(entry[labelKey])}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconSize={10}
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          formatter={(value) => (
            <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenericPieChart;
