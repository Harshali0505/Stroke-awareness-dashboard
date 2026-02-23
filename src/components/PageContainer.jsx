import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LAYOUT_COLORS } from '../constants/colors';

const PageContainer = ({
  children,
  title,
  description,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hideNavbar = false
}) => {
  return (
    <div className="app-shell" style={{ backgroundColor: LAYOUT_COLORS.pageBackground }}>
      {!hideNavbar && (
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      <main className={`main-content ${hideNavbar ? '' : 'with-sidebar'}`}>
        <div className="content-max">
          {(title || description) && (
            <header className="page-header">
              {title && <h1 className="page-title">{title}</h1>}
              {description && <p className="page-description">{description}</p>}
            </header>
          )}

          <div className="page-content">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PageContainer;
