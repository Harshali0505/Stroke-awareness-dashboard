import React from 'react';
import { AWARENESS_COLORS } from '../constants/colors';

const KPICard = ({ title, value, subtitle, trend, icon }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return AWARENESS_COLORS.high;
      case 'down':
        return AWARENESS_COLORS.low;
      default:
        return 'var(--text-tertiary)';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '';
    }
  };

  return (
    <div className="kpi-card">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </div>

        {icon && (
          <div
            style={{
              fontSize: '22px',
              color: 'var(--primary)',
              backgroundColor: 'var(--neutral-50)',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: '34px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          lineHeight: '1',
          letterSpacing: '-0.5px'
        }}
      >
        {value}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: trend ? '12px' : '0',
            lineHeight: '1.4'
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Trend */}
      {trend && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '600',
            marginTop: 'auto'
          }}
        >
          <span style={{ color: getTrendColor(trend) }}>
            {getTrendIcon(trend)}{' '}
            {trend === 'up' ? 'Increased' : 'Decreased'}
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
