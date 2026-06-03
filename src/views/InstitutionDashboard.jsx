import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building, Users, GitMerge, Rocket, Award, GraduationCap,
  ChevronRight, AlertCircle, TrendingUp, Search, Filter, BookOpen, Check, Play, Terminal
} from 'lucide-react';

export default function InstitutionDashboard() {
  const { pitchMode, currentView, addNotification } = useApp();

  // Mock candidates data
  const studentsRegistry = [
    { name: "Saransh Wadhwani", department: "cse", degree: "B.Tech Computer Science & Engineering", target: "Software Engineer", score: 68, status: "Reviewing", skills: ["Python", "HTML", "CSS", "SQL", "Javascript"] },
    { name: "Priya Sharma", department: "aids", degree: "B.Tech AI & Data Science", target: "AI Engineer", score: 85, status: "Placement-Ready", skills: ["Python", "Machine Learning", "Pandas", "SQL", "PyTorch"] },
    { name: "Tariq Mahmood", department: "eee", degree: "B.Tech Electronics & Embedded Eng", target: "Embedded Developer", score: 74, status: "Reviewing", skills: ["C++", "Arduino", "Verilog", "Microcontrollers"] },
    { name: "Chloe Henderson", department: "mech", degree: "B.Tech Mechanical & Automation Eng", target: "CAD Design Engineer", score: 81, status: "Placement-Ready", skills: ["SolidWorks", "AutoCAD", "MATLAB", "Ansys"] },
    { name: "Yusuf Demir", department: "cse", degree: "M.Tech Computer Science", target: "DevOps Architect", score: 58, status: "Needs Improvement", skills: ["Linux", "Git", "Docker", "AWS", "Bash"] }
  ];

  // Mock department metadata
  const departmentConfigs = {
    cse: { name: "Computer Science & Engineering", hod: "Dr. A. K. Sharma", students: 180, faculty: 12, rating: "82.6%" },
    aids: { name: "Artificial Intelligence & Data Systems", hod: "Dr. R. K. Gupta", students: 120, faculty: 8, rating: "81.0%" },
    eee: { name: "Electronics & Embedded Engineering", hod: "Prof. M. L. Vyas", students: 90, faculty: 6, rating: "71.4%" },
    mech: { name: "Mechanical & Automation Sciences", hod: "Dr. S. P. Bansal", students: 150, faculty: 10, rating: "58.2%" }
  };

  // State for Departments View
  const [selectedDept, setSelectedDept] = useState("cse");
  const [deptSearch, setDeptSearch] = useState("");

  // State for Skill Trends View
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditCompleted, setAuditCompleted] = useState(false);

  const runSkillAuditSim = () => {
    setAuditRunning(true);
    setAuditCompleted(false);
    setAuditLogs([
      "🔍 Starting campus-wide Student Employability Skill Audit...",
      "⏳ Connecting to university registrar databases...",
    ]);

    setTimeout(() => {
      setAuditLogs(prev => [...prev, "✓ Connected. Parsing student repository updates..."]);
    }, 600);

    setTimeout(() => {
      setAuditLogs(prev => [...prev, "✓ Analyzing Resume Scanner ATS match records..."]);
    }, 1200);

    setTimeout(() => {
      setAuditLogs(prev => [
        ...prev,
        "✓ Syncing AI roadmap assignment checklists...",
        "✓ Auditing 540 active modules across 4 departments...",
        "🏆 Audit completed successfully! Campus metrics updated."
      ]);
      setAuditRunning(false);
      setAuditCompleted(true);
      addNotification("📊 Campus Skill Audit successfully finalized. Aggregates synchronized.");
    }, 2000);
  };

  // Filtered students for Departments View
  const deptStudents = useMemo(() => {
    return studentsRegistry.filter(s => {
      const matchDept = s.department === selectedDept;
      const matchSearch = deptSearch.trim() === "" || s.name.toLowerCase().includes(deptSearch.toLowerCase()) || s.target.toLowerCase().includes(deptSearch.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [selectedDept, deptSearch]);

  // ── VIEW 1: COLLEGE METRICS (TAB 1) ───────────────────────────────────────
  const renderCollegeMetrics = () => (
    <>
      {/* Metrics Row */}
      <div className="institution-analytics-matrix">
        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(6,182,212,0.08)', color: 'var(--accent)' }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>72.4%</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campus Readiness</p>
          </div>
        </div>

        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>24,500+</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Skills Audited</p>
          </div>
        </div>

        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(168,85,247,0.08)', color: 'var(--secondary)' }}>
            <GitMerge size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>1,240</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Roadmaps</p>
          </div>
        </div>

        <div className="institution-stat-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="stat-card-icon-round" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
            <Rocket size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>14</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Startups Incubated</p>
          </div>
        </div>
      </div>

      {/* Leaderboard and Gaps Grid */}
      <div className="readiness-progress-charts-matrix">
        {/* Department Leaderboard */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={16} className="text-secondary" />
            <span>Departmental Employability Leaderboards</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(departmentConfigs).map(([key, config]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>{config.name}</span>
                  <strong>{config.rating}</strong>
                </div>
                <div style={{ height: '6px', background: 'rgba(15,23,42,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: config.rating, background: key === 'cse' ? '#6366f1' : key === 'aids' ? '#a855f7' : key === 'eee' ? '#06b6d4' : '#10b981' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill gaps across campus */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '6px' }}>
            Campus-wide Critical Skill Gaps
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>1. Client Frameworks (React.js):</span>
            <strong style={{ color: 'var(--danger)' }}>480 Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>2. Containers & Microservices (Docker):</span>
            <strong style={{ color: 'var(--danger)' }}>410 Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>3. Unit Test Assertions (Jest/Mocha):</span>
            <strong style={{ color: 'var(--warning)' }}>320 Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>4. Server Orchestrations (CI/CD):</span>
            <strong style={{ color: 'var(--warning)' }}>280 Students</strong>
          </div>
        </div>
      </div>

      {/* Placements Registry */}
      <div className="dashboard-data-table-wrapper">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ fontSize: '16px' }}>Candidate Placement Registries</h3>
        </div>

        <table className="premium-data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Degree Course</th>
              <th>Target Profession</th>
              <th>Readiness Score</th>
              <th>AI Verification Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsRegistry.map((st, idx) => {
              const isReady = st.status === 'Placement-Ready';
              const isWarning = st.status === 'Needs Improvement';

              let statusColor = 'var(--text-secondary)';
              let statusBg = 'rgba(255,255,255,0.03)';
              if (isReady) {
                statusColor = '#10b981';
                statusBg = 'rgba(16,185,129,0.08)';
              } else if (isWarning) {
                statusColor = '#ef4444';
                statusBg = 'rgba(239,68,68,0.08)';
              }

              return (
                <tr key={idx}>
                  <td style={{ fontWeight: '600' }}>{st.name}</td>
                  <td>{st.degree}</td>
                  <td>{st.target}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{st.score}%</td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', color: statusColor, background: statusBg, border: `1.5px solid ${statusColor}33` }}>
                      {st.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => alert(`Recruiter request compiled for ${st.name}! Interview invitations queued.`)}
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', gap: '4px' }}
                    >
                      Invite Recruiter <ChevronRight size={10} />
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

  // ── VIEW 2: DEPARTMENTS DIRECTORY (TAB 2) ────────────────────────────────
  const renderDepartments = () => {
    const activeDept = departmentConfigs[selectedDept];

    return (
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        {/* Department filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.entries(departmentConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedDept(key)}
              style={{
                padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)',
                background: selectedDept === key ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedDept === key ? 'white' : 'var(--text-primary)',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <GraduationCap size={16} />
              {config.name.replace(" Engineering", "").replace(" Sciences", "")}
            </button>
          ))}
        </div>

        {/* Selected Department Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { label: "Department Head", val: activeDept.hod, color: "var(--primary)" },
            { label: "Enrolled Students", val: `${activeDept.students} students`, color: "var(--accent)" },
            { label: "Active Faculty", val: `${activeDept.faculty} professors`, color: "var(--secondary)" },
            { label: "Average Employability", val: activeDept.rating, color: "var(--success)" }
          ].map(({ label, val, color }) => (
            <div key={label} className="glass-panel" style={{ padding: '16px 20px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '500' }}>{label}</span>
              <h4 style={{ fontSize: '20px', fontWeight: '800', color, marginTop: '4px', fontFamily: 'var(--font-heading)' }}>{val}</h4>
            </div>
          ))}
        </div>

        {/* Department Students registries */}
        <div className="dashboard-data-table-wrapper">
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '16px' }}>Student Directory — {activeDept.name}</h3>
            {/* Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                placeholder="Search students..."
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                style={{
                  width: '100%', padding: '7px 12px 7px 32px', borderRadius: '8px',
                  border: '1px solid var(--border-light)', background: 'var(--bg-card)',
                  color: 'var(--text-primary)', fontSize: '13px', outline: 'none'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <table className="premium-data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Target Career Path</th>
                <th>Core Skill Profile</th>
                <th>Score</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {deptStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No student registry matches the current search query.
                  </td>
                </tr>
              ) : (
                deptStudents.map((st, idx) => {
                  const isReady = st.status === 'Placement-Ready';
                  const isWarning = st.status === 'Needs Improvement';

                  let statusColor = 'var(--text-secondary)';
                  let statusBg = 'rgba(255,255,255,0.03)';
                  if (isReady) {
                    statusColor = '#10b981';
                    statusBg = 'rgba(16,185,129,0.08)';
                  } else if (isWarning) {
                    statusColor = '#ef4444';
                    statusBg = 'rgba(239,68,68,0.08)';
                  }

                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600' }}>{st.name}</td>
                      <td>{st.target}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {st.skills.slice(0, 3).map(sk => (
                            <span key={sk} className="badge-glow" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px' }}>{sk}</span>
                          ))}
                          {st.skills.length > 3 && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+{st.skills.length - 3} more</span>}
                        </div>
                      </td>
                      <td style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{st.score}%</td>
                      <td>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', color: statusColor, background: statusBg, border: `1.5px solid ${statusColor}33` }}>
                          {st.status}
                        </span>
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
  };

  // ── VIEW 3: SKILL TRENDS (TAB 3) ─────────────────────────────────────────
  const renderSkillTrends = () => (
    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {[
          { label: "Top In-Demand Skill", val: "React.js Framework", desc: "480 students pending focus" },
          { label: "Average Skills Audited", val: "4.8 skills/student", desc: "Across all active registries" },
          { label: "Certification Velocity", val: "+14.2% MoM", desc: "Based on weekly assignments logs" },
          { label: "Placement Success Ratio", val: "76.5% Target Met", desc: "Direct recruitment invitations" }
        ].map(({ label, val, desc }) => (
          <div key={label} className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>{label}</span>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '6px 0' }}>{val}</h4>
            <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '500' }}>{desc}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 992 ? '1fr' : '1fr 340px', gap: '20px' }}>
        {/* Left Side: Demand Analysis & Audit console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Skill Auditing Console */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', margin: 0 }}>Campus Skill Verification Audit</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Audits github records, resume keyword checks, and checklist marks.
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={runSkillAuditSim}
                disabled={auditRunning}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 16px' }}
              >
                <Play size={12} fill="white" style={{ stroke: 'none' }} /> Run Global Audit
              </button>
            </div>

            <div style={{ height: '140px', background: '#020617', borderRadius: '10px', border: '1px solid #1e293b', padding: '12px 16px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '6px' }}>
                <Terminal size={12} /> Audit Terminal logs
              </div>
              {auditLogs.length === 0 && (
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Console standing by. Click "Run Global Audit" to verification pipeline logs.
                </div>
              )}
              {auditLogs.map((log, idx) => (
                <div key={idx} style={{
                  fontFamily: "monospace", fontSize: '12px',
                  color: log.includes("completed") || log.includes("updates") || log.includes("Audit") ? '#10b981' : '#e2e8f0',
                  lineHeight: '1.4'
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Skill Trends list */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
              <span>Campus Skill Growth Velocity</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { skill: "Frontend frameworks (React.js, Vue)", growth: "+18.4% last month", pct: 85, color: "var(--primary)" },
                { skill: "Data Engineering (Python, Pandas, SQL)", growth: "+15.0% last month", pct: 72, color: "var(--accent)" },
                { skill: "Microservice Dev (Docker, Express)", growth: "+9.2% last month", pct: 54, color: "var(--secondary)" },
                { skill: "CI/CD & Clouds (GitLab, AWS, Actions)", growth: "+6.1% last month", pct: 40, color: "var(--success)" }
              ].map(({ skill, growth, pct, color }) => (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>{skill}</span>
                    <strong style={{ color }}>{growth}</strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(15,23,42,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Skill gaps panel */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '6px' }}>
            Campus-wide Critical Skill Gaps
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>1. Client Frameworks (React.js):</span>
            <strong style={{ color: 'var(--danger)' }}>480 Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>2. Containers & Microservices (Docker):</span>
            <strong style={{ color: 'var(--danger)' }}>410 Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>3. Unit Test Assertions (Jest/Mocha):</span>
            <strong style={{ color: 'var(--warning)' }}>320 Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>4. Server Orchestrations (CI/CD):</span>
            <strong style={{ color: 'var(--warning)' }}>280 Students</strong>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="institution-dashboard animate-slide-up">
      {/* Pitch Mode Guidelines */}
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
          <div>
            <strong>Dean / College Portal Showcase</strong>: You are viewing the **University Portal Dashboard** for TECHNO NJR INSTITUTE OF TECHNOLOGY. 
            Highlight the departmental leaderboards, active student directory, and the interactive global skill auditor to show judges how dean offices inspect student career readiness live!
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>
          {currentView === 'institution' ? 'University Analytics Console' : currentView === 'institution-departments' ? 'Academic Departments Directory' : 'Campus Skill Demand Trends'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Academic Board Dashboard for **TECHNO NJR INSTITUTE OF TECHNOLOGY** — {currentView === 'institution' ? 'College Metrics' : currentView === 'institution-departments' ? 'Departments Audit' : 'Skills Trends'}.
        </p>
      </div>

      {/* Main tab conditional switch */}
      {currentView === 'institution' && renderCollegeMetrics()}
      {currentView === 'institution-departments' && renderDepartments()}
      {currentView === 'institution-trends' && renderSkillTrends()}
    </div>
  );
}
