import React from 'react';

const Footer = ({ sidebarWidth }) => {
  const year = new Date().getFullYear();
  return (
    <footer
      className="footer"
      style={{
        /* Span full viewport width — sidebar is position:fixed so it overlays us */
        width: '100%',
        marginLeft: 0,
        flexShrink: 0
      }}
    >
      <div className="footer-container">
        <p className="footer-text">
          © {year} Stroke Awareness &amp; Risk Patterns Dashboard. All rights reserved.
        </p>
        <span className="footer-badge">
          Built with <span>♥</span> for public health insights
        </span>
      </div>
    </footer>
  );
};

export default Footer;
