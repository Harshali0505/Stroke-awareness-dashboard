import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBarChart2,
  FiUsers,
  FiActivity,
  FiAlertTriangle,
  FiZap,
  FiRadio,
  FiChevronsLeft,
  FiChevronsRight,
  FiSun,
  FiMoon,
  FiTarget
} from 'react-icons/fi';
import { useTheme } from '../App';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Sidebar starts expanded (false = not collapsed); localStorage persists user preference
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = window.localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);

  const mobileOpen = isMobileMenuOpen ?? internalMobileOpen;
  const setMobileOpen = setIsMobileMenuOpen ?? setInternalMobileOpen;

  // Sync HTML class + localStorage whenever collapsed state changes
  React.useLayoutEffect(() => {
    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed');
    } else {
      document.documentElement.classList.remove('sidebar-collapsed');
    }
    window.localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  const isActive = (path) =>
    location.pathname === path || (path === '/' && location.pathname === '/overview');

  // Navigation items — labels match the exact page titles
  const navItems = [
    {
      path: '/',
      label: 'The Big Picture: Stroke Awareness',
      icon: <FiBarChart2 />
    },
    {
      path: '/demographics',
      label: 'Demographic Awareness Distribution',
      icon: <FiUsers />
    },
    {
      path: '/lifestyle',
      label: 'Lifestyle Patterns',
      icon: <FiActivity />
    },
    {
      path: '/knowledge-gap',
      label: 'Knowledge Gaps & Misconceptions',
      icon: <FiAlertTriangle />
    },
    {
      path: '/emergency',
      label: 'Time-Critical Awareness',
      icon: <FiZap />
    },
    {
      path: '/community',
      label: 'Communication Channels & Community Knowledge',
      icon: <FiRadio />
    },
    {
      path: '/personas',
      label: 'Behavioral Personas',
      icon: <FiTarget />
    },
  ];

  const handleNavClick = () => {
    setMobileOpen(false);

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const main = document.querySelector('main.main-content');
    if (main) {
      main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      main.scrollTop = 0;
    }
  };
  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);

  return (
    <nav className={`navbar sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="navbar-container">

        {/* ——— Brand ——— */}
        <div className="navbar-brand">
          <div className="logo-placeholder" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>

          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="brand-text">Stroke Analytics</span>
              <span className="brand-subtitle">Awareness Dashboard</span>
            </div>
          )}


          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed
              ? <FiChevronsRight size={14} />
              : <FiChevronsLeft size={14} />}
          </button>
        </div>

        {/* ——— Section label (hidden when collapsed) ——— */}
        {!isCollapsed && (
          <span className="nav-section-label">Navigation</span>
        )}

        {/* ——— Nav links ——— */}
        <nav className="navbar-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className="nav-link"
                data-active={active ? 'true' : 'false'}
                title={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {/* Label shown in expanded state, hidden by CSS when collapsed */}
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ——— Theme toggle floating button ——— */}
      <button
        type="button"
        className="theme-toggle-floating"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    </nav>
  );
};

export default Navbar;
