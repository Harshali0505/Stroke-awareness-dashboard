import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAwarenessColor, CHART_COLORS } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const renderOuterLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="var(--text-secondary, #64748b)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontFamily="Inter, sans-serif"
      fontWeight={600}
    >
      {(percent * 100).toFixed(1)}%
    </text>
  );
};

const GenericPieChart = ({
  data,
  labelKey = "label",
  valueKey = "percentage",
  selectedValue = null,
  onSelect = null,
  height = 320,
  innerRadius = 70,
  interaction = "click",
  showOuterLabels = true,
  colors = null
}) => {
  const isHover = interaction === "hover";
  const [activeIndex, setActiveIndex] = React.useState(null);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={labelKey}
          cx="50%"
          cy="50%"
          outerRadius="80%"
          innerRadius={innerRadius}
          labelLine={showOuterLabels}
          label={showOuterLabels ? renderOuterLabel : false}
          onClick={(d) => {
            if (isHover) return;
            onSelect && onSelect(d[labelKey]);
          }}
          onMouseEnter={(_, idx) => {
            if (!isHover) return;
            setActiveIndex(idx);
          }}
          onMouseLeave={() => {
            if (!isHover) return;
            setActiveIndex(null);
          }}
        >
          {data && data.map && data.map((entry, index) => {
            const isActive = isHover
              ? activeIndex === null || index === activeIndex
              : (!selectedValue || entry[labelKey] === selectedValue);

            return (
              <Cell
                key={index}
                fill={colors ? colors[index % colors.length] : getAwarenessColor(entry[labelKey])}
                opacity={isActive ? 1 : CHART_COLORS.inactiveOpacity}
                cursor={isHover ? "default" : (onSelect ? "pointer" : "default")}
                stroke="var(--bg-surface)"
                strokeWidth={2}
              />
            );
          })}
        </Pie>

        <Tooltip content={<ChartTooltip />} />

        <Legend
          iconSize={0}
          wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}
          onClick={(e) => {
            if (isHover) return;
            onSelect && onSelect(e.value);
          }}
          formatter={(value, entry, index) => (
            <span style={{ color: 'var(--text-secondary, #64748b)', fontFamily: 'Inter, sans-serif' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: colors ? colors[index % colors.length] : getAwarenessColor(value),
                  marginRight: '6px',
                  borderRadius: '50%'
                }}
              />
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenericPieChart;
