import React from 'react';

/**
 * DashboardLayout — lightweight page wrapper used by some pages.
 * Styling is fully controlled by CSS custom properties in index.css.
 */
const DashboardLayout = ({ children, title }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'var(--font-sans, Inter, sans-serif)' }}>
      {/* Inline header for standalone pages */}
      <header
        style={{
          background: 'var(--bg-sidebar)',
          color: 'var(--text-inverse)',
          padding: '16px 28px',
          boxShadow: 'var(--shadow)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.3px'
            }}
          >
            {title || 'Public Health Analytics Dashboard'}
          </h1>

          <nav style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
            {[
              { href: '#overview',     label: 'Overview' },
              { href: '#awareness',    label: 'Awareness' },
              { href: '#demographics', label: 'Demographics' },
              { href: '#trends',       label: 'Trends' }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  color: 'rgba(255,255,255,0.78)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.78)';
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '36px 28px' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
