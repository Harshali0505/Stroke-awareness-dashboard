import React from 'react';

const ChartPanel = ({
  title,
  sectionTag,
  severity = 'blue',
  severityLabel,
  callout,
  helperText,
  noFixedHeight = false,
  children,
  className = ''
}) => {
  const message = callout || helperText;

  return (
    <div className={`card-type-5 on-${severity} animate-card ${className}`}>
      <div className="t5-header">
        <h2 className="text-heading-1" style={{ margin: 0 }}>{title}</h2>
        {sectionTag && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="tag-pill text-label">{sectionTag}</span>
            {severityLabel && (
              <span className="severity-pill text-label">{severityLabel}</span>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className={`card-type-4 on-${severity} text-body`}>
          {message}
        </div>
      )}

      {/* Grid equal-height enforcement inside main wrapper */}
      <div className="chart-wrapper" style={noFixedHeight ? { height: 'auto', minHeight: 'unset' } : {}}>
        {children}
      </div>
    </div>
  );
};

export default ChartPanel;
