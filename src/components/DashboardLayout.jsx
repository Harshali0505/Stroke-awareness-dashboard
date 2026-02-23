import React from 'react';
import { LAYOUT_COLORS, CHART_STYLES } from '../constants/colors';

const DashboardLayout = ({ children, title }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: LAYOUT_COLORS.pageBackground,
        fontFamily: CHART_STYLES.fontFamily
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: LAYOUT_COLORS.navbar,
          color: LAYOUT_COLORS.textOnDark,
          padding: '16px 24px',
          boxShadow: `0 4px 10px ${LAYOUT_COLORS.shadow}`,
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '700',
              color: LAYOUT_COLORS.textOnDark,
              letterSpacing: '-0.5px'
            }}
          >
            {title || 'Public Health Analytics Dashboard'}
          </h1>

          {/* Section Navigation */}
          <nav
            style={{
              display: 'flex',
              gap: '32px',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            {[
              { href: '#overview', label: 'Overview' },
              { href: '#awareness', label: 'Awareness' },
              { href: '#demographics', label: 'Demographics' },
              { href: '#trends', label: 'Trends' }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  color: LAYOUT_COLORS.textOnDark,
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor =
                    'rgba(255, 255, 255, 0.12)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px'
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
