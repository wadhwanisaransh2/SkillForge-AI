import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Flame, Target, Sparkles, User, LogOut, Menu, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const {
    currentView, setCurrentView,
    userRole, setUserRole,
    studentProfile,
    streakCount,
    readinessScore,
    notifications,
    markAllNotificationsRead,
    pitchMode, setPitchMode,
    mobileSidebarOpen, setMobileSidebarOpen,
    logoutUser
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleRoleChange = (role) => {
    setUserRole(role);
    if (role === 'student') {
      setCurrentView('dashboard');
    } else if (role === 'institution') {
      setCurrentView('institution');
    } else if (role === 'admin') {
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="main-navbar" style={{ borderBottom: 'none' }}>
      {/* Premium top gradient line separator */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2.5px',
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
        zIndex: 1001
      }}></div>

      {/* Brand Logo & Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentView !== 'landing' && currentView !== 'auth' && (
          <button
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={22} />
          </button>
        )}
        <div className="nav-brand" onClick={() => setCurrentView('landing')}>
          <div className="nav-brand-icon">
            <Sparkles size={20} className="text-white" />
          </div>
          <h2>SkillForge AI</h2>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        {/* Dynamic Pitch Mode Toggle (High-Contrast & legible styling) */}
        <div
          className={`pitch-mode-container ${pitchMode ? 'active' : ''}`}
          onClick={() => setPitchMode(!pitchMode)}
          title="Toggle Judge/Demo Architecture Overlays"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: pitchMode ? '#fffbeb' : 'rgba(148, 163, 184, 0.05)',
            border: `1px solid ${pitchMode ? '#d97706' : 'var(--border-light)'}`,
            padding: '6px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Sparkles size={14} color={pitchMode ? "#d97706" : "#64748b"} fill={pitchMode ? "#d97706" : "none"} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: pitchMode ? '#78350f' : '#64748b' }}>
            {pitchMode ? 'Pitch Mode: Active' : 'Enable Pitch Mode'}
          </span>
        </div>

        {/* Quick Perspective Selector for Hackathon Presentation */}
        {currentView !== 'landing' && (
          <div className="role-quick-selector" title="Demonstrate different roles to judges">
            <button
              className={`role-selector-btn ${userRole === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleChange('student')}
            >
              Student
            </button>
            <button
              className={`role-selector-btn ${userRole === 'institution' ? 'active' : ''}`}
              onClick={() => handleRoleChange('institution')}
            >
              College
            </button>
            <button
              className={`role-selector-btn ${userRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              Admin
            </button>
          </div>
        )}

        {/* User Stats Odometer Chips (Only show if logged in and in Student mode) */}
        {currentView !== 'landing' && userRole === 'student' && (
          <div className="nav-user-stats">
            <div className="stat-chip stat-chip-streak" title="Daily streak tracker">
              <Flame size={14} fill="#fbbf24" style={{ stroke: 'none' }} />
              <span>{streakCount} Days</span>
            </div>
            <div className="stat-chip stat-chip-ready" title="AI aggregate readiness indicator">
              <Target size={14} />
              <span>{readinessScore}% Ready</span>
            </div>
          </div>
        )}

        {/* Notifications and Profile Buttons */}
        {currentView !== 'landing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            {/* Notification Bell */}
            <div
              className="notification-bell-container"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <Bell size={20} className="text-secondary" />
              {unreadCount > 0 && <div className="notification-badge-red"></div>}
            </div>

            {/* Notifications Box Dropdown */}
            {showNotifications && (
              <div className="notifications-panel glass-panel">
                <div className="notification-header">
                  <h4>Activity Logs</h4>
                  {unreadCount > 0 && (
                    <span onClick={() => {
                      markAllNotificationsRead();
                      setShowNotifications(false);
                    }}>
                      Mark all read
                    </span>
                  )}
                </div>
                <div className="notification-list-items">
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', padding: '12px' }}>
                      No new notifications.
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                        <p>{n.text}</p>
                        <div className="notification-item-time">{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* User Profile avatar dropdown */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <div className="avatar-circle-sm">
                {getInitials(studentProfile.name)}
              </div>
            </div>

            {showProfileMenu && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: '0',
                  width: '200px',
                  padding: '12px',
                  zIndex: 1002,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: 'var(--glass-shadow)'
                }}
              >
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '13px' }}>{studentProfile.name}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{studentProfile.email}</p>
                </div>

                <div
                  className="sidebar-item"
                  style={{ padding: '8px', fontSize: '12px', gap: '8px' }}
                  onClick={() => {
                    setCurrentView('dashboard');
                    setUserRole('student');
                    setShowProfileMenu(false);
                  }}
                >
                  <User size={14} />
                  <span>My Profile</span>
                </div>

                <div
                  className="sidebar-item"
                  style={{ padding: '8px', fontSize: '12px', gap: '8px', color: 'var(--danger)' }}
                  onClick={() => {
                    handleLogout();
                    setShowProfileMenu(false);
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'landing' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentView('auth')} style={{ padding: '9px 20px', fontSize: '13.5px' }}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => setCurrentView('auth')} style={{ padding: '9px 20px', fontSize: '13.5px' }}>
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
