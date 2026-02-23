import React from 'react';
import { LAYOUT_COLORS } from '../constants/colors';

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundColor: LAYOUT_COLORS.navbar,
        color: LAYOUT_COLORS.textOnDark,
        padding: '12px 24px',
        textAlign: 'center',
        fontSize: '13px'
      }}
    >
      <div
        className="footer-container"
        style={{
          opacity: 0.85
        }}
      >
        © 2026 Stroke Awareness & Risk Patterns Dashboard
      </div>
    </footer>
  );
};

export default Footer;
