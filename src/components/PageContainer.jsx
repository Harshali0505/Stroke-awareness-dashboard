import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PageContainer = ({
  children,
  title,
  description,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hideNavbar = false
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-app)'
      }}
    >
      {/* ——— Sidebar ——— */}
      {!hideNavbar && (
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      {/* ——— Main content area (flex: 1 so footer stays at bottom) ——— */}
      <main
        className={`main-content ${hideNavbar ? '' : 'with-sidebar'}`}
        style={{ flex: 1 }}
      >
        <div className="content-max">
          {(title || description) && (
            <header className="page-header">
              {title && <h1 className="page-title">{title}</h1>}
              {description && (
                <p className="page-description">{description}</p>
              )}
            </header>
          )}
          <div className="page-content">{children}</div>
        </div>
      </main>

      {/* ——— Full-width footer (outside main, below sidebar) ——— */}
      <Footer sidebarWidth={hideNavbar ? 0 : true} />
    </div>
  );
};

export default PageContainer;
