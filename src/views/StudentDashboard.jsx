import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Flame, Target, Trophy, ChevronRight, Zap, CheckCircle2, GraduationCap, AlertCircle, X, Play, Code2, Clock, TrendingUp, BookOpen, Rocket, Brain, FileText, BarChart3 } from 'lucide-react';

export default function StudentDashboard() {
  const {
    studentProfile,
    currentView, setCurrentView,
    skillScore,
    readinessScore,
    projectScore,
    entrepreneurScore,
    streakCount, setStreakCount,
    dailyChallenge,
    badges,
    roadmap,
    addNotification,
    unlockBadge,
    pitchMode
  } = useApp();

  const [challengeSolved, setChallengeSolved] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [userCode, setUserCode] = useState(`// Write your solution here\nfunction solution() {\n  // Your code here\n  \n}\n\n// Test your solution\nconsole.log(solution());`);
  const [codeOutput, setCodeOutput] = useState(null);
  const [runningCode, setRunningCode] = useState(false);

  // SVG Gauge Renderer
  const CircularGauge = ({ pct, title, strokeColor, onClick }) => {
    const radius = 48;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (pct / 100) * circ;

    const getLabel = () => {
      if (pct >= 80) return { text: 'Excellent', color: 'var(--success)' };
      if (pct >= 60) return { text: 'Good', color: 'var(--warning)' };
      return { text: 'Improving', color: '#94a3b8' };
    };
    const label = getLabel();

    return (
      <div
        className="gauge-card glass-panel"
        style={{ border: '1px solid var(--border-light)', transition: 'var(--transition-smooth)', cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>{title}</h4>
        <div className="gauge-svg-container">
          <svg width="130" height="130" viewBox="0 0 120 120">
            <circle className="gauge-circle-bg" cx="60" cy="60" r={radius} />
            <circle
              className="gauge-circle-bar"
              cx="60" cy="60" r={radius}
              stroke={strokeColor}
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="gauge-text-center" style={{ color: strokeColor }}>{pct}%</div>
        </div>
        <span style={{ fontSize: '11px', fontWeight: '600', color: label.color, background: `${label.color}18`, padding: '2px 10px', borderRadius: '10px', border: `1px solid ${label.color}30` }}>
          {label.text}
        </span>
      </div>
    );
  };

  const handleSolveChallenge = () => {
    setShowChallengeModal(true);
  };

  const handleRunCode = () => {
    if (runningCode) return;
    setRunningCode(true);
    setCodeOutput(null);
    setTimeout(() => {
      setRunningCode(false);
      setCodeOutput({
        success: true,
        output: '✅ Test 1: PASSED — "racecar" is a palindrome\n✅ Test 2: PASSED — "hello world" → not a palindrome\n✅ Test 3: PASSED — "A man a plan a canal Panama" → palindrome\n\n🎯 All 3/3 tests passed! Well done!',
        time: '12ms',
        memory: '4.2 MB'
      });
    }, 1800);
  };

  const handleMarkSolved = () => {
    if (challengeSolved) return;
    setChallengeSolved(true);
    setStreakCount(prev => prev + 1);
    addNotification("🔥 Daily challenge solved! Streak increased to " + (streakCount + 1) + " days.");
    unlockBadge("Code Warrior");
    setShowChallengeModal(false);
  };

  // Get active week details with defensive programming check
  const activeWeek = (roadmap && roadmap.length > 0)
    ? (roadmap.find(w => !w.completed && !w.locked) || roadmap[0])
    : null;

  const completedWeeks = roadmap ? roadmap.filter(w => w.completed).length : 0;
  const totalWeeks = roadmap ? roadmap.length : 8;
  const roadmapProgress = Math.round((completedWeeks / totalWeeks) * 100);

  const quickNavItems = [
    { icon: Brain, label: 'Skill Gap Analysis', view: 'gap-analyzer', color: 'var(--primary)', desc: 'Analyze your skill gaps with AI' },
    { icon: BookOpen, label: 'Learning Roadmap', view: 'roadmap', color: 'var(--accent)', desc: 'Follow your personalized path' },
    { icon: FileText, label: 'Mock Interview', view: 'mock-interview', color: 'var(--secondary)', desc: 'Practice with AI interviewer' },
    { icon: Rocket, label: 'Startup Launchpad', view: 'entrepreneur', color: '#10b981', desc: 'Build your startup idea' },
  ];

  return (
    <div className="dashboard-view animate-slide-up">
      {/* Pitch Mode Guidelines */}
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--warning)' }} />
          <div>
            <strong>Judge Presentation Tip</strong>: You are viewing the <strong>Student Hub</strong>.
            The four circular gauges update in real-time. Click any gauge to navigate to that module.
            Try clicking <strong>"Solve Challenge"</strong> to open an interactive code editor — type a solution and run it! 🚀
          </div>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="dashboard-header-panel">
        <div className="profile-summary-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div className="profile-left-meta">
            <div className="avatar-circle-lg">
              {studentProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-text-details">
              <h2>Welcome back, {studentProfile.name} 👋</h2>
              <p>{studentProfile.degree} ({studentProfile.year})</p>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{studentProfile.college}</span>
              {/* Skills Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {(studentProfile.skills || []).slice(0, 5).map(skill => (
                  <span key={skill} className="badge-glow" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>
                    {skill}
                  </span>
                ))}
                {(studentProfile.skills || []).length > 5 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '3px 8px' }}>
                    +{studentProfile.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <div className="profile-target-pill glass-panel badge-glow">
              <Target size={14} />
              <span>Target: {studentProfile.targetRole}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Flame size={14} fill="var(--warning)" style={{ stroke: 'none', color: 'var(--warning)' }} />
              <span style={{ fontWeight: '600', color: 'var(--warning)' }}>{streakCount} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Circular Gauges Matrix — clickable to navigate */}
      <div className="dashboard-grid-widgets">
        <CircularGauge pct={skillScore} title="Skill Score" strokeColor="var(--primary)" onClick={() => setCurrentView('gap-analyzer')} />
        <CircularGauge pct={readinessScore} title="Industry Readiness" strokeColor="var(--accent)" onClick={() => setCurrentView('readiness')} />
        <CircularGauge pct={projectScore} title="Project Completion" strokeColor="var(--secondary)" onClick={() => setCurrentView('projects')} />
        <CircularGauge pct={entrepreneurScore} title="Incubator Readiness" strokeColor="var(--success)" onClick={() => setCurrentView('entrepreneur')} />
      </div>

      {/* Quick Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {quickNavItems.map(({ icon: Icon, label, view, color, desc }) => (
          <div
            key={view}
            className="glass-card-interactive"
            style={{ padding: '20px', cursor: 'pointer' }}
            onClick={() => setCurrentView(view)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{label}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '11px', color, fontWeight: '600' }}>
              <span>Open</span>
              <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary layouts Grid */}
      <div className="dashboard-twin-grid">
        {/* Left Side: Learning Timeline Overview */}
        <div className="timeline-overview-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} className="text-cyan" />
              <span>Roadmap In-Progress</span>
            </h3>
            <button
              onClick={() => setCurrentView('roadmap')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}
            >
              <span>View Full Path</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <span>Overall Roadmap Progress</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{completedWeeks}/{totalWeeks} weeks</span>
            </div>
            <div style={{ height: '6px', background: 'var(--bg-slate)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${roadmapProgress}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '3px', transition: 'width 1.2s ease' }}></div>
            </div>
          </div>

          {activeWeek ? (
            <div style={{ background: 'rgba(99, 102, 241, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '14px' }}>Week {activeWeek.week}: {activeWeek.title}</h4>
                <span className="badge-glow" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px' }}>Active</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                {activeWeek.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeWeek.topics.map((t, idx) => (
                  <span key={idx} className="badge-glow" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px' }}>{t}</span>
                ))}
              </div>
              {/* Task completion for this week */}
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                <span>
                  {activeWeek.tasks.filter(t => t.completed).length}/{activeWeek.tasks.length} tasks complete
                </span>
                <button
                  onClick={() => setCurrentView('roadmap')}
                  style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(99, 102, 241, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No active weekly roadmap found. Go to <strong>AI Skill Gap</strong> to generate your custom learning path!
            </div>
          )}

          {/* Badges Cabinet */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Trophy size={16} className="text-secondary" />
              <span>Achievement Badge Cabinet</span>
            </h3>
            <div className="dashboard-badges-container">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`badge-item-mini ${badge.unlocked ? 'unlocked' : ''}`}
                  title={badge.desc}
                  style={{ position: 'relative' }}
                >
                  <Award size={14} />
                  <span>{badge.title}</span>
                  {badge.unlocked && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', border: '1.5px solid white' }}></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Coding Challenges */}
        <div className="dashboard-challenges-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <div>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Zap size={18} fill="var(--warning)" style={{ stroke: 'none', color: 'var(--warning)' }} />
              <span>Daily Challenge Arena</span>
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Complete challenges to maintain your <strong style={{ color: 'var(--warning)' }}>{streakCount} day streak</strong> and claim badges!
            </p>

            <div className="challenge-box" style={{ background: 'rgba(99, 102, 241, 0.03)', marginTop: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Code2 size={15} style={{ color: 'var(--primary)' }} />
                <h5 style={{ color: 'var(--primary)', fontSize: '13px' }}>{challengeSolved ? '✅ Solved!' : 'Today\'s Problem:'}</h5>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} /> ~15 mins
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>{dailyChallenge}</p>
              {challengeSolved && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)', borderRadius: '8px', fontSize: '12px', color: 'var(--success)' }}>
                  🎉 Challenge completed! +1 streak, badge unlocked.
                </div>
              )}
            </div>
          </div>

          <div>
            {!challengeSolved ? (
              <button
                className="btn-primary"
                onClick={handleSolveChallenge}
                style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
              >
                <Play size={16} fill="white" style={{ stroke: 'none' }} />
                Open Interactive Solver
              </button>
            ) : (
              <button
                className="btn-cyan"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '12px', background: 'rgba(5, 150, 105, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', boxShadow: 'none', cursor: 'default' }}
                disabled
              >
                <CheckCircle2 size={16} /> Completed (+1 Streak)
              </button>
            )}

            {/* Stats summary row */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, background: 'var(--bg-slate)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--warning)', fontFamily: 'var(--font-heading)' }}>{streakCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Day Streak</div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-slate)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>{badges.filter(b => b.unlocked).length}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Badges Earned</div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-slate)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{readinessScore}%</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Job Ready</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
              <GraduationCap size={14} />
              <span>Tip: Run AI Skill Gap Analysis to customize your recommendations.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solve Challenge Modal */}
      {showChallengeModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowChallengeModal(false); }}
        >
          <div
            className="glass-panel animate-slide-up"
            style={{ width: '100%', maxWidth: '860px', padding: '0', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))' }}>
              <div>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 size={20} style={{ color: 'var(--primary)' }} /> Interactive Code Challenge
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Day {new Date().getDate()} — JavaScript / Python</p>
              </div>
              <button onClick={() => setShowChallengeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
              {/* Problem Statement */}
              <div style={{ padding: '24px', borderRight: '1px solid var(--border-light)', overflowY: 'auto' }}>
                <div className="badge-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', marginBottom: '16px' }}>
                  <Zap size={11} /> Easy Difficulty
                </div>
                <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Palindrome Checker</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
                  {dailyChallenge}
                </p>
                <div style={{ background: 'var(--bg-slate)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Examples:</div>
                  <code style={{ fontSize: '12px', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>isPalindrome("racecar") → true</code>
                  <code style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>isPalindrome("hello") → false</code>
                  <code style={{ fontSize: '12px', color: 'var(--primary)', display: 'block' }}>isPalindrome("A man a plan a canal Panama") → true</code>
                </div>
                <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--primary)' }}>Constraints:</strong><br />
                  • Ignore spaces and punctuation<br />
                  • Case insensitive<br />
                  • O(n) time complexity preferred
                </div>
              </div>

              {/* Code Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['#ef4444', '#eab308', '#22c55e'].map(c => (
                    <span key={c} style={{ width: '10px', height: '10px', background: c, borderRadius: '50%' }}></span>
                  ))}
                  <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>solution.js</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  style={{
                    flex: 1, background: '#0f172a', color: '#e2e8f0', border: 'none', outline: 'none',
                    fontFamily: "'Courier New', monospace", fontSize: '13px', lineHeight: '1.6',
                    padding: '16px', resize: 'none', minHeight: '200px'
                  }}
                  spellCheck={false}
                />

                {/* Output Panel */}
                {codeOutput && (
                  <div style={{ background: '#0a0f1e', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', maxHeight: '160px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', display: 'flex', gap: '12px' }}>
                      <span>⚡ {codeOutput.time}</span>
                      <span>💾 {codeOutput.memory}</span>
                    </div>
                    <pre style={{ fontSize: '12px', color: codeOutput.success ? '#10b981' : '#f87171', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {codeOutput.output}
                    </pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ padding: '12px 16px', background: '#1e293b', display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={handleRunCode}
                    disabled={runningCode}
                    style={{
                      flex: 1, padding: '10px', background: 'rgba(8,145,178,0.2)', border: '1px solid rgba(8,145,178,0.4)',
                      color: '#22d3ee', borderRadius: '8px', cursor: runningCode ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '13px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      opacity: runningCode ? 0.7 : 1
                    }}
                  >
                    <Play size={14} fill="#22d3ee" style={{ stroke: 'none' }} />
                    {runningCode ? 'Running...' : 'Run Tests'}
                  </button>
                  <button
                    onClick={handleMarkSolved}
                    disabled={challengeSolved}
                    style={{
                      flex: 1, padding: '10px', background: challengeSolved ? 'rgba(5,150,105,0.15)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      border: challengeSolved ? '1px solid var(--success)' : 'none', color: challengeSolved ? 'var(--success)' : 'white',
                      borderRadius: '8px', cursor: challengeSolved ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '13px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {challengeSolved ? 'Solved!' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
