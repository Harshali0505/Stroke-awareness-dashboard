import React from "react";

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
        background: '#1a2332',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        pointerEvents: 'none',
        zIndex: 9999,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Category label */}
      <div style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '4px'
      }}>
        {label || data.label || 'Value'}
      </div>

      {/* Recharts simple tooltip mode */}
      {data.percentage !== undefined && (
        <>
          <div style={{
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#ffffff',
            display: 'block'
          }}>
            {data.percentage}%
          </div>
          {data.count !== undefined && (
            <div style={{
              fontSize: '12px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.6)',
              marginTop: '2px'
            }}>
              Participants: {data.count}
            </div>
          )}
        </>
      )}

      {/* Multi-series Tooltip fallback */}
      {data.percentage === undefined && seriesRows.length > 0 && (
        <div style={{ marginTop: '0px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {seriesRows.map((row) => (
            <div key={row.key} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                fontSize: '22px',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#ffffff',
                display: 'block'
              }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: row.color || '#14b8a6',
                    marginRight: '6px',
                    verticalAlign: 'middle',
                    marginBottom: '4px'
                  }}
                />
                {typeof row.value === 'number' ? 
                  (String(row.value).includes('.') ? `${row.value.toFixed(1)}%` : `${row.value}%`) 
                  : row.value
                }
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.6)',
                marginTop: '0px'
              }}>
                {row.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;
