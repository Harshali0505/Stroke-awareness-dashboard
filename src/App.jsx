import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import OverallAwareness from './pages/OverallAwareness';
import Demographics from './pages/Demographics';
import Lifestyle from './pages/Lifestyle';
import KnowledgeGap from './pages/KnowledgeGap';
import Emergency from './pages/Emergency';
import Community from './pages/Community';
import Personas from './pages/Personas';

// ——— Theme Context ———
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure each route starts from the top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Some browsers/pages may use documentElement/body for scrolling
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // If your layout scrolls inside a container (dashboard-style), reset that too
    const main = document.querySelector('main.main-content');
    if (main) {
      main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      main.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ——— Theme state ———
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dashboard-theme') || 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // ——— Mobile detection ———
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sharedProps = {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app">

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Overlay for mobile menu */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <Router>
          <ScrollToTop />
          <Routes>
            {/* Core pages */}
            <Route path="/"               element={<OverallAwareness {...sharedProps} />} />
            <Route path="/overview"       element={<OverallAwareness {...sharedProps} />} />
            <Route path="/demographics"   element={<Demographics     {...sharedProps} />} />
            <Route path="/lifestyle"      element={<Lifestyle        {...sharedProps} />} />
            <Route path="/knowledge-gap"  element={<KnowledgeGap    {...sharedProps} />} />
            <Route path="/emergency"      element={<Emergency        {...sharedProps} />} />
            <Route path="/community"      element={<Community        {...sharedProps} />} />
            <Route path="/personas"       element={<Personas         {...sharedProps} />} />
          </Routes>
        </Router>

      </div>
    </ThemeContext.Provider>
  );
}

export default App;
