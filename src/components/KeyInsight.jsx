import React from 'react';

/**
 * KeyInsight — wraps a text insight below a chart with a
 * labeled callout box so users know it's a curated data takeaway.
 *
 * Usage:
 *   <KeyInsight>The low awareness portion is highest across all age groups...</KeyInsight>
 */
const KeyInsight = ({ children }) => (
  <div className="key-insight">
    <span className="key-insight__label" style={{
      fontSize: '1rem',
      backgroundColor: 'rgba(15, 118, 110, 0.15)',
      color: 'var(--brand-primary)',
      padding: '4px 10px',
      borderRadius: '6px',
      textTransform: 'none',
      letterSpacing: 'normal'
    }}>
      Key Insight
    </span>
    <p className="key-insight__text">{children}</p>
  </div>
);

export default KeyInsight;
