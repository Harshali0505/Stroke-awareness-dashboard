import React from 'react';
import { AWARENESS_COLORS } from '../constants/colors';

const KPICard = ({ title, value, subtitle, trend, icon }) => {
  const getTrendColor = (t) => {
    if (t === 'up')   return 'var(--color-success)';
    if (t === 'down') return 'var(--color-danger)';
    return 'var(--text-tertiary)';
  };

  const getTrendIcon = (t) => {
    if (t === 'up')   return '↑';
    if (t === 'down') return '↓';
    return '';
  };

  const getTrendLabel = (t) => {
    if (t === 'up')   return 'Increased';
    if (t === 'down') return 'Decreased';
    return '';
  };

  return (
    <div className="kpi-card">
      {/* Icon */}
      {icon && (
        <div className="kpi-icon-wrap" aria-hidden="true">
          {icon}
        </div>
      )}

      {/* Title */}
      <div className="kpi-title">{title}</div>

      {/* Value */}
      <div className="kpi-value">{value ?? '—'}</div>

      {/* Subtitle */}
      {subtitle && (
        <div className="kpi-subtitle">{subtitle}</div>
      )}

      {/* Trend */}
      {trend && (
        <div
          className="kpi-trend"
          style={{ color: getTrendColor(trend) }}
          aria-label={`Trend: ${getTrendLabel(trend)}`}
        >
          <span>{getTrendIcon(trend)}</span>
          <span>{getTrendLabel(trend)}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
