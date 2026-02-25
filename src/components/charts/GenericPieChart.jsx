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
      fill={CHART_COLORS.axis}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
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
          outerRadius={Math.min(height / 2 - 30, 120)}
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
              />
            );
          })}
        </Pie>

        <Tooltip content={<ChartTooltip />} />

        <Legend
          iconSize={0}
          wrapperStyle={{ paddingTop: "20px" }}
          onClick={(e) => {
            if (isHover) return;
            onSelect && onSelect(e.value);
          }}
          formatter={(value, entry, index) => (
            <span style={{ color: "#023337" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: colors ? colors[index % colors.length] : getAwarenessColor(value),
                  marginRight: "6px",
                  borderRadius: "2px"
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
