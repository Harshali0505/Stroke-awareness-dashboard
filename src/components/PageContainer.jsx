import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * pageHeaderMeta shape:
 *   { sectionTag: 'SECTION 02', severity: 'critical'|'moderate'|'good'|'info', severityLabel: 'Critical' }
 */
const PageContainer = ({
  children,
  title,
  description,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hideNavbar = false,
  pageHeaderMeta = null,
}) => {
  const getSeverityClass = (sev) => {
    if (sev === 'critical') return 'on-red';
    if (sev === 'moderate') return 'on-amber';
    if (sev === 'good') return 'on-green';
    return 'on-blue';
  };

  const meta = pageHeaderMeta;
  const sevClass = meta ? getSeverityClass(meta.severity) : 'on-blue';

  return (
    <div className="app-layout">
      {/* ——— Sidebar ——— */}
      {!hideNavbar && (
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      {/* ——— Main content area ——— */}
      <main className="main-content">
        <div className="content-max">
          {(title || description) && (
            <header className="zone-a">
              {/* Top row: section tag + severity badge */}
              {meta && (
                <div className={`zone-a-meta ${sevClass}`}>
                  {meta.sectionTag && (
                    <span className="tag-pill text-label">{meta.sectionTag}</span>
                  )}
                  <span className="severity-pill text-label">
                    {meta.severityLabel || 'Info'}
                  </span>
                </div>
              )}

              {/* Title */}
              {title && <h1 className="text-hero" style={{ marginBottom: '12px' }}>{title}</h1>}

              {/* Description / subtitle */}
              {description && (
                <p className="text-body" style={{ color: 'var(--text-muted)' }}>{description}</p>
              )}
            </header>
          )}
          
          {children}
        </div>
      </main>

    </div>
  );
};

export default PageContainer;
