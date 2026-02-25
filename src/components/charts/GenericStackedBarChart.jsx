import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { CHART_COLORS, getAwarenessColor } from "../../constants/colors";
import ChartTooltip from "../common/ChartTooltip";

const GenericStackedBarChart = ({
  data,
  groupKey,
  stackKey = "category",
  valueKey = "percentage",
  selectedCategory = null,
  onSelectCategory = null,
  width = 750,
  height = 400
}) => {
  const [hiddenCategories, setHiddenCategories] = React.useState(() => new Set());

  const groups = [...new Set(data.map(d => d[groupKey]))];
  const categories = [...new Set(data.map(d => d[stackKey]))];

  const chartData = groups.map(group => {
    const row = { [groupKey]: group };
    data
      .filter(d => d[groupKey] === group)
      .forEach(d => {
        row[d[stackKey]] = d[valueKey];
      });
    return row;
  });

  return (
    <BarChart width={width} height={height} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
      <XAxis dataKey={groupKey} stroke={CHART_COLORS.axis} />
      <YAxis stroke={CHART_COLORS.axis} />
      <Tooltip content={<ChartTooltip />} />
      <Legend
        onClick={(e) => {
          const value = e?.value;
          if (!value) return;
          setHiddenCategories((prev) => {
            const next = new Set(prev);
            if (next.has(value)) next.delete(value);
            else next.add(value);
            return next;
          });
        }}
      />

      {categories.map(cat => {
        const isActive = !selectedCategory || cat === selectedCategory;
        return (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="a"
            fill={getAwarenessColor(cat)}
            hide={hiddenCategories.has(cat)}
            opacity={isActive ? 1 : CHART_COLORS.inactiveOpacity}
            cursor={onSelectCategory ? "pointer" : "default"}
            onClick={() => onSelectCategory && onSelectCategory(cat)}
          />
        );
      })}
    </BarChart>
  );
};

export default GenericStackedBarChart;
