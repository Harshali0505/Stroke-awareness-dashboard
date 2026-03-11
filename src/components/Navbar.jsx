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
  FiMoon
} from 'react-icons/fi';
import { useTheme } from '../App';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Sidebar starts expanded (false = not collapsed); localStorage persists user preference
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);

  const mobileOpen = isMobileMenuOpen ?? internalMobileOpen;
  const setMobileOpen = setIsMobileMenuOpen ?? setInternalMobileOpen;

  // Restore persisted collapse state on mount
  React.useEffect(() => {
    const saved = window.localStorage.getItem('sidebarCollapsed');
    const shouldCollapse = saved === 'true';
    setIsCollapsed(shouldCollapse);
    if (shouldCollapse) {
      document.documentElement.classList.add('sidebar-collapsed');
    } else {
      document.documentElement.classList.remove('sidebar-collapsed');
    }
  }, []);

  // Sync HTML class + localStorage whenever collapsed state changes
  React.useEffect(() => {
    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed');
    } else {
      document.documentElement.classList.remove('sidebar-collapsed');
    }
    window.localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  const isActive = (path) =>
    location.pathname === path || (path === '/' && location.pathname === '/overview');

  // Labels match the exact page h1 titles
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
      label: '3. Lifestyle Patterns',
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
  ];

  const handleNavClick = () => setMobileOpen(false);
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
                {/* Label shown in expanded state, hidden by CSS class in collapsed state */}
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer pushes theme toggle to bottom */}
        <div style={{ flex: 1 }} />

        {/* ——— Theme toggle ——— */}
        <div className="sidebar-bottom">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ width: '100%' }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-toggle-icon">
              {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
            </span>
            {!isCollapsed && (
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
