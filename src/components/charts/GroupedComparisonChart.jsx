import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { CHART_COLORS } from "../../constants/colors";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--tooltip-bg, #ffffff)',
        border: '1px solid var(--tooltip-border, rgba(148,163,184,0.25))',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary, #0f172a)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        minWidth: '200px'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(148,163,184,0.15)' }}>
          {label}
        </div>
        {payload.map((entry) => (
          <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: entry.color, borderRadius: '2px' }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--brand-primary, #0f766e)' }}>{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const GroupedComparisonChart = ({
  data = [],
  dataKeys = [], // e.g., [{ key: "Smokers", color: "#f43f5e" }, { key: "Non-Smokers", color: "#10b981" }]
  height = 360
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid || "#e2e8f0"} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary, #64748b)', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-tertiary, #94a3b8)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
            tickFormatter={(value) => `${value}%`}
            width={45}
            domain={[0, 'auto']}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(148,163,184,0.08)' }} 
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}
            iconType="circle"
          />
          
          {dataKeys.map((dk) => (
            <Bar 
              key={dk.key} 
              dataKey={dk.key} 
              name={dk.label || dk.key}
              fill={dk.color} 
              radius={[4, 4, 0, 0]} 
              maxBarSize={60}
              animationDuration={800}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupedComparisonChart;
