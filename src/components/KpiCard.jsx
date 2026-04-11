import React from 'react';

const KpiCard = ({ topLabel = 'INFO', title, value, subtitle, severity = 'blue', className = '' }) => {
  return (
    <div className={`card-type-1 on-${severity} animate-card ${className}`}>
      {topLabel && (
        <div className="t1-label text-label" style={{ marginBottom: '12px' }}>
          {topLabel}
        </div>
      )}
      <div className="big-number">{value ?? '—'}</div>
      {subtitle && <div className="big-number-context">{subtitle}</div>}
    </div>
  );
};

export default KpiCard;
