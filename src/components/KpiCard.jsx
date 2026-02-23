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
    <div
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: 'none',
        border: '1px solid var(--neutral-200)',
        height: '100%',
        transition: 'border-color 0.2s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'var(--primary)'
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}
      >
        <div
          style={{
            color: 'var(--text-tertiary)',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.6px'
          }}
        >
          {title}
        </div>

        {icon && (
          <div
            style={{
              fontSize: '22px',
              color: 'var(--primary-light)',
              opacity: 0.85
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '12px',
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
            opacity: 0.85,
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
            fontWeight: '600'
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
