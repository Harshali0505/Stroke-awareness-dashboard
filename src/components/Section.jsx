import React from 'react';

const Section = ({ title, helperText, children, zone = 'zone-c' }) => {
  return (
    <section className={`app-section ${zone}`}>
      {(title || helperText) && (
        <header style={{ marginBottom: '20px' }}>
          {title && <h2 className="text-heading-1" style={{ marginBottom: '8px' }}>{title}</h2>}
          {helperText && <p className="text-body-sm text-secondary">{helperText}</p>}
        </header>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
};

export default Section;
