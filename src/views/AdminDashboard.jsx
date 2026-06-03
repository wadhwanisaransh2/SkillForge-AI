import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck, HardDrive, Cpu, Terminal, Users, Building, AlertCircle,
  Search, Filter, Lock, Trash2, Key, Info, X, ShieldAlert, CheckCircle, Ban
} from 'lucide-react';
import db from '../services/dbService';

export default function AdminDashboard() {
  const { pitchMode, currentView, addNotification } = useApp();

  // Mock server diagnostics logs
  const serverLogs = [
    "[INFO] 2026-05-31 16:02:14: SkillForge AI Gateway initialized on port 8080 successfully.",
    "[INFO] 2026-05-31 16:02:15: Establishing persistent shard bindings to MongoDB Cluster shard-0...",
    "[OK]   2026-05-31 16:02:16: Connection to MongoDB Cluster main-shard-0 established. Latency: 14ms.",
    "[INFO] 2026-05-31 16:02:18: Generative NLP parser thread pool initialized (Thread-Pool-4, 8 Workers).",
    "[INFO] 2026-05-31 16:02:19: Syncing regional collegiate databases registries (114 active universities).",
    "[OK]   2026-05-31 16:02:22: SSL Certificate verified. Authority: Let's Encrypt Global. Valid: Dec 2026.",
    "[OK]   2026-05-31 16:02:25: Speech-to-Text API pipeline verified for Mock Interview loop engines.",
    "[INFO] 2026-06-03 15:40:00: Client request: Saransh Wadhwani (student) fetched personal learning timeline."
  ];

  // Load dynamic users from dbService + add standard administrative deans/admins
  const [usersList, setUsersList] = useState(() => {
    const dbUsers = [];
    try {
      const usersMap = db.getAllUsers();
      Object.values(usersMap).forEach(u => {
        dbUsers.push({
          name: u.profile.name,
          email: u.email,
          college: u.profile.college || 'TECHNO NJR INSTITUTE OF TECHNOLOGY',
          role: 'Student Candidate',
          sessions: u.metrics?.streakCount * 3 || 18,
          status: 'Active',
          readiness: u.metrics?.readinessScore || 68,
          skills: u.profile.skills || ["Python", "SQL"]
        });
      });
    } catch (e) {
      console.error(e);
    }

    const standardMockUsers = [
      { name: "Dr. Rajesh Kumar", email: "rajesh.kumar@technonjr.org", college: "TECHNO NJR INSTITUTE OF TECHNOLOGY", role: "Institution Dean", sessions: 42, status: "Active", readiness: null, skills: [] },
      { name: "Admin Core Root", email: "root@skillforge.ai", college: "SkillForge HQ", role: "Platform SuperAdmin", sessions: 104, status: "Active", readiness: null, skills: [] },
      { name: "Sarah Jenkins", email: "sarah.jenkins@mit.edu", college: "MIT", role: "Institution Dean", sessions: 29, status: "Active", readiness: null, skills: [] }
    ];

    // Filter out duplicates if email matches
    const filteredMock = standardMockUsers.filter(mu => !dbUsers.some(du => du.email.toLowerCase() === mu.email.toLowerCase()));
    return [...dbUsers, ...filteredMock];
  });

  // State for User Directories View
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUserForAudit, setSelectedUserForAudit] = useState(null);

  // Toggle user suspension status
  const handleToggleStatus = (email) => {
    setUsersList(prev => prev.map(u => {
      if (u.email === email) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        addNotification(`Admin Action: User ${email} account status set to ${newStatus}.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  // Reset password handler simulation
  const handleResetPassword = (name, email) => {
    alert(`Reset password authentication link dispatched successfully to ${name} (${email}).`);
    addNotification(`Admin Security Action: Password reset token dispatched to ${email}.`);
  };

  // Filtered users map
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || 
                        (roleFilter === 'student' && u.role === 'Student Candidate') || 
                        (roleFilter === 'dean' && u.role === 'Institution Dean') || 
                        (roleFilter === 'admin' && u.role === 'Platform SuperAdmin');
      return matchSearch && matchRole;
    });
  }, [usersList, searchQuery, roleFilter]);

  // ── VIEW 1: PLATFORM SECURITY & DIAGNOSTICS (TAB 1) ──────────────────────
  const renderPlatformSecurity = () => (
    <>
      {/* Metrics Diagnostic Row */}
      <div className="institution-analytics-matrix">
        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>18,240</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Users</p>
          </div>
        </div>

        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(6,182,212,0.08)', color: 'var(--accent)' }}>
            <Building size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>114</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Partner Academies</p>
          </div>
        </div>

        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(168,85,247,0.08)', color: 'var(--secondary)' }}>
            <Cpu size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>84,200</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scans Run</p>
          </div>
        </div>

        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
            <HardDrive size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>99.98%</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gateway Status</p>
          </div>
        </div>
      </div>

      {/* Diagnostics Logs Terminal */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Terminal size={16} className="text-cyan" />
          <span>API Gateway & Database Handshake Logs</span>
        </h3>

        <div className="admin-diagnostics-log-box">
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            SYSTEM CORE GATEWAY ACTIVE CHECKPOINT LOGS:
          </div>
          {serverLogs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '6px' }}>{log}</div>
          ))}
        </div>
      </div>

      {/* Central User registry summary */}
      <div className="dashboard-data-table-wrapper">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ fontSize: '16px' }}>Central User Security Audits</h3>
        </div>

        <table className="premium-data-table">
          <thead>
            <tr>
              <th>Registered User</th>
              <th>Email Identifier</th>
              <th>Security Access Role</th>
              <th>Total Session Logs</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.slice(0, 4).map((usr, idx) => {
              const isRoot = usr.role === 'Platform SuperAdmin';
              const isDean = usr.role === 'Institution Dean';

              let roleColor = 'var(--text-secondary)';
              let roleBg = 'rgba(255,255,255,0.03)';
              if (isRoot) {
                roleColor = '#ef4444';
                roleBg = 'rgba(239,68,68,0.08)';
              } else if (isDean) {
                roleColor = '#a855f7';
                roleBg = 'rgba(168,85,247,0.08)';
              }

              return (
                <tr key={idx}>
                  <td style={{ fontWeight: '600' }}>{usr.name}</td>
                  <td>{usr.email}</td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', color: roleColor, background: roleBg, border: `1.5px solid ${roleColor}33` }}>
                      {usr.role}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{usr.sessions}</td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', color: usr.status === 'Active' ? '#10b981' : 'var(--danger)', background: usr.status === 'Active' ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.08)' }}>
                      {usr.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleResetPassword(usr.name, usr.email)}
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px' }}
                    >
                      Audit Access
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );

  // ── VIEW 2: USER DIRECTORIES DIRECTORY (TAB 2) ───────────────────────────
  const renderUserDirectories = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stats summaries cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {[
          { label: "Total Platform Users", val: "18,240 users", color: "var(--primary)" },
          { label: "Active Student profiles", val: "12,450 candidates", color: "var(--accent)" },
          { label: "Collegiate Admins / Deans", val: "1,240 administrators", color: "var(--secondary)" },
          { label: "Platform Operators", val: "150 superusers", color: "#10b981" }
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '16px 20px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '500' }}>{label}</span>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color, marginTop: '4px', fontFamily: 'var(--font-heading)' }}>{val}</h4>
          </div>
        ))}
      </div>

      {/* Directory filter and search bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '320px' }}>
          <input
            type="text"
            placeholder="Search name, email, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '9px 14px 9px 36px', borderRadius: '10px',
              border: '1px solid var(--border-light)', background: 'var(--bg-card)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
            }}
          />
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Roles' },
            { key: 'student', label: 'Students' },
            { key: 'dean', label: 'Deans' },
            { key: 'admin', label: 'Admins' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key)}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'var(--font-heading)',
                background: roleFilter === key ? 'var(--primary)' : 'var(--bg-slate)',
                color: roleFilter === key ? 'white' : 'var(--text-secondary)',
                border: roleFilter === key ? 'none' : '1px solid var(--border-light)',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main directories table */}
      <div className="dashboard-data-table-wrapper">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ fontSize: '16px' }}>Collegiate & Candidate Registries ledger</h3>
        </div>

        <table className="premium-data-table">
          <thead>
            <tr>
              <th>User Account</th>
              <th>Email Identifier</th>
              <th>College Institution</th>
              <th>Access Level</th>
              <th>Streak / sessions</th>
              <th>Account status</th>
              <th>Audits</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No active users match your query configurations.
                </td>
              </tr>
            ) : (
              filteredUsers.map((usr, idx) => {
                const isRoot = usr.role === 'Platform SuperAdmin';
                const isDean = usr.role === 'Institution Dean';

                let roleColor = 'var(--text-secondary)';
                let roleBg = 'rgba(255,255,255,0.03)';
                if (isRoot) {
                  roleColor = '#ef4444';
                  roleBg = 'rgba(239,68,68,0.08)';
                } else if (isDean) {
                  roleColor = '#a855f7';
                  roleBg = 'rgba(168,85,247,0.08)';
                }

                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{usr.name}</td>
                    <td>{usr.email}</td>
                    <td>{usr.college}</td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', color: roleColor, background: roleBg, border: `1.5px solid ${roleColor}33` }}>
                        {usr.role}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{usr.sessions}</td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', color: usr.status === 'Active' ? '#10b981' : 'var(--danger)', background: usr.status === 'Active' ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.08)' }}>
                        {usr.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedUserForAudit(usr)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                            color: 'var(--primary)', borderRadius: '4px'
                          }}
                          title="Show User Audit logs"
                        >
                          <Info size={15} />
                        </button>
                        <button
                          onClick={() => handleResetPassword(usr.name, usr.email)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                            color: 'var(--warning)', borderRadius: '4px'
                          }}
                          title="Trigger Password Reset link"
                        >
                          <Key size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(usr.email)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                            color: usr.status === 'Active' ? 'var(--danger)' : '#10b981', borderRadius: '4px'
                          }}
                          title={usr.status === 'Active' ? 'Suspend user account' : 'Reactivate user account'}
                        >
                          {usr.status === 'Active' ? <Ban size={15} /> : <CheckCircle size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-view animate-slide-up">
      {/* Pitch Mode Guidelines */}
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
          <div>
            <strong>Platform Administrator Showcase</strong>: You are viewing the **Platform Admin Panel**. 
            Verify gateway telemetry logs on the Security view, and audit registries, suspend credentials, or dispatch credential password reset links on the User Directories ledger!
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>
          {currentView === 'admin' ? 'Platform Diagnostics Console' : 'Platform User Registry Directory'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Root System Administration Command Center — {currentView === 'admin' ? 'Platform Security & Diagnostics' : 'User Directories Ledger'}.
        </p>
      </div>

      {/* Main switch routing */}
      {currentView === 'admin' && renderPlatformSecurity()}
      {currentView === 'admin-directories' && renderUserDirectories()}

      {/* ─── AUDIT DETAILS MODAL ─────────────────────────────────────────────── */}
      {selectedUserForAudit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box'
        }}>
          <div className="glass-panel animate-scale-up" style={{
            width: '100%', maxWidth: '480px', background: 'var(--bg-card)',
            borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-slate)'
            }}>
              <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={15} style={{ color: 'var(--primary)' }} /> User Security Audit Report
              </h3>
              <button
                onClick={() => setSelectedUserForAudit(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Name & Email ID</span>
                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>{selectedUserForAudit.name}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedUserForAudit.email}</span>
              </div>

              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Associated Collegiate Institution</span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>{selectedUserForAudit.college}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Security Access Level</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '2px 0 0 0', fontWeight: '600' }}>{selectedUserForAudit.role}</p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Account Status</span>
                  <p style={{ fontSize: '13px', color: selectedUserForAudit.status === 'Active' ? '#10b981' : 'var(--danger)', margin: '2px 0 0 0', fontWeight: '600' }}>
                    {selectedUserForAudit.status}
                  </p>
                </div>
              </div>

              {selectedUserForAudit.role === 'Student Candidate' && (
                <div style={{ background: 'var(--bg-slate)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={12} style={{ color: 'var(--accent)' }} /> Career Readiness Audit Summary
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>Aggregate Employability Score:</span>
                    <strong>{selectedUserForAudit.readiness || 68}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>Current Active Skills:</span>
                    <strong style={{ fontSize: '11px' }}>{selectedUserForAudit.skills?.join(', ')}</strong>
                  </div>
                </div>
              )}

              {/* Action details */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    handleResetPassword(selectedUserForAudit.name, selectedUserForAudit.email);
                    setSelectedUserForAudit(null);
                  }}
                  style={{ fontSize: '12px' }}
                >
                  Reset password
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setSelectedUserForAudit(null)}
                  style={{ fontSize: '12px' }}
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
