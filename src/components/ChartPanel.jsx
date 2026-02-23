import React from 'react';

const ChartPanel = ({ title, helperText, children, fullWidth = false }) => {
  return (
    <div className={`who-panel ${fullWidth ? 'who-panel--full' : ''}`}>
      {(title || helperText) && (
        <div className="who-panel__header">
          {title && <h3 className="who-panel__title">{title}</h3>}
          {helperText && <p className="who-panel__helper">{helperText}</p>}
        </div>
      )}
      <div className="who-panel__body">{children}</div>
    </div>
  );
};

export default ChartPanel;
