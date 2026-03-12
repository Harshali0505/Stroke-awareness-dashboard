import React from 'react';

/**
 * KpiCard — color-coded by severity.
 *
 * severity: 'danger'  → red  (low awareness / bad metric)
 *           'warning' → amber (medium / caution)
 *           'success' → green (high awareness / good metric)
 *           'neutral' → teal (informational, default)
 */
const KpiCard = ({ title, value, subtitle, trend, icon, severity = 'neutral' }) => {
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

  const badgeLabel = {
    danger:  '● Critical',
    warning: '● Moderate',
    success: '● Good',
    neutral: '● Total',
  }[severity] ?? '';

  const cardClass = `kpi-card${severity !== 'neutral' ? ` kpi-card--${severity}` : ''}`;

  return (
    <div className={cardClass}>
      {/* Severity badge */}
      {badgeLabel && (
        <div className={`kpi-severity-badge kpi-severity-badge--${severity}`}>
          {badgeLabel}
        </div>
      )}

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

export default KpiCard;
