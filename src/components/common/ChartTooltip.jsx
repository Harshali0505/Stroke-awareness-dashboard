import React from "react";

/**
 * Universal chart tooltip — adapts to light/dark mode via CSS variables.
 * No logic changes; only visual styling.
 */
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
        background: 'var(--tooltip-bg, #ffffff)',
        border: '1px solid var(--tooltip-border, rgba(148,163,184,0.25))',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary, #0f172a)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        minWidth: '160px',
        pointerEvents: 'none'
      }}
    >
      {/* X-axis / group label */}
      {label && (
        <div
          style={{
            fontWeight: 700,
            marginBottom: '6px',
            fontSize: '12px',
            color: 'var(--text-primary, #0f172a)',
            borderBottom: '1px solid var(--border, rgba(148,163,184,0.15))',
            paddingBottom: '6px'
          }}
        >
          {label}
        </div>
      )}

      {/* Category / slice label */}
      {data.label && (
        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
          {data.label}
        </div>
      )}

      {/* Participant count */}
      {data.count !== undefined && (
        <div style={{ color: 'var(--text-secondary, #64748b)', marginBottom: '2px' }}>
          Participants: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{data.count}</strong>
        </div>
      )}

      {/* Percentage */}
      {data.percentage !== undefined && (
        <div style={{ color: 'var(--text-secondary, #64748b)' }}>
          Percentage: <strong style={{ color: 'var(--brand-primary, #0f766e)' }}>{data.percentage}%</strong>
        </div>
      )}

      {/* Multi-series rows */}
      {data.percentage === undefined && seriesRows.length > 0 && (
        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {seriesRows.map((row) => (
            <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '2px',
                  flexShrink: 0,
                  backgroundColor: row.color || '#14b8a6'
                }}
              />
              <span style={{ flex: 1, color: 'var(--text-secondary, #64748b)' }}>
                {row.name}:
              </span>
              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                {typeof row.value === 'number' ? `${row.value.toFixed(1)}%` : row.value}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;
