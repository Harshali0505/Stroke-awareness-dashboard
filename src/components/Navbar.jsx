import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiUsers,
  FiActivity,
  FiAlertTriangle,
  FiZap,
  FiRadio,
  FiTarget,
  FiChevronsLeft,
  FiChevronsRight,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { useTheme } from '../App';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = window.localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);

  const mobileOpen = isMobileMenuOpen ?? internalMobileOpen;
  const setMobileOpen = setIsMobileMenuOpen ?? setInternalMobileOpen;

  React.useLayoutEffect(() => {
    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed');
    } else {
      document.documentElement.classList.remove('sidebar-collapsed');
    }
    window.localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/overview',
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
    {
      path: '/predict',
      label: 'Patient Risk Predictor (ML)',
      icon: <FiRadio />
    },
  ];

  const handleNavClick = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const main = document.querySelector('.main-content');
    if (main) {
      main.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Brand Area */}
        <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--brand-primary)', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                <FiTarget size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>BrainLine</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Stroke Awareness Research Dashboard</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}
          >
            {isCollapsed ? <FiChevronsRight size={18} /> : <FiChevronsLeft size={18} />}
          </button>
        </div>

        {/* Nav Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          <div style={{ padding: '0 16px' }}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                  style={{ margin: '4px 0' }}
                >
                  <div className="sidebar-nav-icon">{item.icon}</div>
                  {!isCollapsed && (
                    <div className="sidebar-nav-label text-body-sm">{item.label}</div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Area */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            onClick={handleNavClick}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              padding: '10px 16px', borderRadius: '8px', textDecoration: 'none',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
          >
            <FiChevronsLeft size={16} />
            {!isCollapsed && <span style={{ fontSize: '13px', fontWeight: 500 }}>Back to Homepage</span>}
          </Link>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff',
              padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', width: '100%',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
          >
            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            {!isCollapsed && <span style={{ fontSize: '13px', fontWeight: 500 }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
