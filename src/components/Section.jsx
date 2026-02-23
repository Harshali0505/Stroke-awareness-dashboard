import React from 'react';

const Section = ({ title, helperText, children }) => {
  return (
    <section className="who-section">
      {(title || helperText) && (
        <header className="who-section__header">
          {title && <h2 className="who-section__title">{title}</h2>}
          {helperText && <p className="who-section__helper">{helperText}</p>}
        </header>
      )}
      <div className="who-section__content">{children}</div>
    </section>
  );
};

export default Section;
