import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiUsers,
  FiAlertTriangle,
  FiActivity,
  FiInfo,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);

  const mobileOpen = isMobileMenuOpen ?? internalMobileOpen;
  const setMobileOpen = setIsMobileMenuOpen ?? setInternalMobileOpen;

  React.useEffect(() => {
    const saved = window.localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
      document.documentElement.classList.add('sidebar-collapsed');
    }
  }, []);

  React.useEffect(() => {
    if (isCollapsed) document.documentElement.classList.add('sidebar-collapsed');
    else document.documentElement.classList.remove('sidebar-collapsed');

    window.localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'The Big Picture: Stroke Awareness', icon: <FiBarChart2 /> },
    { path: '/demographics', label: 'Demographic Awareness Distribution', icon: <FiUsers /> },
    { path: '/lifestyle', label: 'Risk Meets Ignorance (Lifestyle & Health Risk)', icon: <FiActivity /> },
    { path: '/knowledge-gap', label: 'Knowledge Gaps and Misconceptions', icon: <FiAlertTriangle /> },
    { path: '/emergency', label: 'Time-Critical Awareness', icon: <FiActivity /> },
    { path: '/community', label: 'Communication Channels & Community Knowledge', icon: <FiInfo /> },
    { path: '/personas', label: 'Behavioral Personas', icon: <FiUsers /> }
  ];

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <nav
      className={`navbar sidebar ${mobileOpen ? 'open' : ''}`}
    >
      <div className="navbar-container">
        {/* Brand */}
        <div
          className="navbar-brand"
        >
          <span className="brand-text">Stroke Dashboard</span>
          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
        </div>

        {/* Navigation */}
        <div className="navbar-nav">
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
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
