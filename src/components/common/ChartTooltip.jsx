import React from "react";
import { LAYOUT_COLORS } from "../../constants/colors";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const seriesRows = payload
    .map((p) => {
      const name = p?.name ?? p?.dataKey;
      return {
        key: String(name ?? "value"),
        name: name,
        value: p?.value,
        color: p?.color
      };
    })
    .filter((row) => row.value !== undefined && row.value !== null);

  return (
    <div
      style={{
        backgroundColor: LAYOUT_COLORS.cardBackground,
        border: `1px solid ${LAYOUT_COLORS.border}`,
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "13px",
        color: LAYOUT_COLORS.textPrimary,
        boxShadow: LAYOUT_COLORS.shadow,
        minWidth: "160px"
      }}
    >
      {/* X-axis / group label */}
      {label && (
        <div style={{ fontWeight: 600, marginBottom: "6px" }}>
          {label}
        </div>
      )}

      {/* Category / slice label */}
      {data.label && (
        <div style={{ fontWeight: 500 }}>
          {data.label}
        </div>
      )}

      {/* Participant count */}
      {data.count !== undefined && (
        <div>
          Participants: <strong>{data.count}</strong>
        </div>
      )}

      {/* Percentage */}
      {data.percentage !== undefined && (
        <div>
          Percentage: <strong>{data.percentage}%</strong>
        </div>
      )}

      {data.percentage === undefined && seriesRows.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {seriesRows.map((row) => (
            <div key={row.key} style={{ display: "flex", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  marginTop: "4px",
                  flexShrink: 0,
                  backgroundColor: row.color || LAYOUT_COLORS.sectionAccent
                }}
              />
              <span style={{ flex: 1 }}>
                {row.name}: <strong>{row.value}</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;
