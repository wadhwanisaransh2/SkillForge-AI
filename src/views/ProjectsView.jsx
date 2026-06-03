import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code2, Play, Terminal, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function ProjectsView() {
  const {
    projects,
    completeProjectInContext,
    pitchMode
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSandboxProject, setActiveSandboxProject] = useState(null); // The project active in sandbox
  const [sandboxCode, setSandboxCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.difficulty === activeFilter);

  const handleStartProject = (project) => {
    setActiveSandboxProject(project);
    setConsoleLogs([
      "Spinning up modern Docker sandbox environment...",
      "Configuring package.json dependencies...",
      "Cloning boilerplate template repository...",
      "Ready. Start coding in index.js!"
    ]);

    // Set sample code based on project
    if (project.id === 'p3') {
      setSandboxCode(
`import React, { useState } from 'react';
import './ExpenseTracker.css';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Server Hosting', amount: 45, date: '2026-05-15' }
  ]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // Complete helper function to calculate total spend
  const totalSpend = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if(!title || !amount) return;
    setExpenses([...expenses, {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0]
    }]);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="expense-tracker-container">
      <h2>Ledger Balance: \${totalSpend}</h2>
      {/* Implement form inputs below */}
    </div>
  );
}`
      );
    } else {
      setSandboxCode(
`// SkillForge AI Sandbox File: index.js
// Build your custom solution below!

function solvePortfolioAssignment() {
  console.log("Analyzing project context: ${project.title}");
  
  // TODO: Implement your algorithmic solution
  
  return true;
}

solvePortfolioAssignment();`
      );
    }
  };

  const handleVerifySandboxCode = () => {
    setIsCompiling(true);
    setConsoleLogs(prev => [...prev, "> npm run test:unit", "Running unit test assertions..."]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        "Test Suite 1: 5 Assertions Passed successfully.",
        "Test Suite 2: Code complexity is O(N). Verified.",
        "🎉 Build Success! Standard production bundle compiled.",
        "Pushing commit to remote repository branch..."
      ]);
      setIsCompiling(false);
      
      // Complete in context
      completeProjectInContext(activeSandboxProject.id);
      alert(`🎉 Project "${activeSandboxProject.title}" successfully verified and saved to your placement portfolio!`);
    }, 1800);
  };

  return (
    <div className="projects-view animate-slide-up">
      {/* Pitch Mode Alerts */}
      {pitchMode && !activeSandboxProject && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
          <div>
            <strong>Judge Presentation Tip</strong>: You are viewing the **AI Project recommendation board**. 
            Try filtering projects by difficulty tabs. 
            Click **"Launch Code Sandbox"** on an incomplete project (e.g. *Expense Tracker*) to open a fully simulated IDE editor split-screen. 
            Clicking **"Verify Code"** inside the IDE executes unit test scripts, updates your portfolio ratio, and rewards you with the **Code Warrior** badge!
          </div>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>AI Project Recommendation Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Hands-on coding assignments tailored specifically to reinforce identified skill gaps in your profile.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="projects-filter-bar">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(tab => (
          <button 
            key={tab}
            className={`role-selector-btn ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
            style={{ fontSize: '13px', padding: '8px 20px', borderRadius: '20px' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="projects-grid">
        {filteredProjects.map(project => {
          const isCompleted = project.completed;
          const isAdvanced = project.difficulty === 'Advanced';
          const isInter = project.difficulty === 'Intermediate';

          let diffColor = '#10b981'; // Green
          let diffBg = 'rgba(16, 185, 129, 0.1)';
          if (isAdvanced) {
            diffColor = '#ef4444'; // Red
            diffBg = 'rgba(239, 68, 68, 0.1)';
          } else if (isInter) {
            diffColor = '#f59e0b'; // Amber
            diffBg = 'rgba(245, 158, 11, 0.1)';
          }

          return (
            <div 
              key={project.id} 
              className="project-card glass-panel"
              style={{ 
                border: isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-light)',
                boxShadow: isCompleted ? '0 8px 32px 0 rgba(16, 185, 129, 0.05)' : 'var(--glass-shadow)'
              }}
            >
              <div className="project-card-top">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: diffColor, background: diffBg, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${diffColor}44` }}>
                    {project.difficulty}
                  </span>
                  {isCompleted && (
                    <span className="badge-success" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                      Portfolio Saved
                    </span>
                  )}
                </div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                <div className="project-tech-tags">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="project-tech-tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="project-card-footer">
                <span>⏱️ {project.time}</span>
                <button 
                  className={isCompleted ? "btn-secondary" : "btn-cyan"} 
                  style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '11px', gap: '4px' }}
                  onClick={() => handleStartProject(project)}
                >
                  <Code2 size={12} />
                  <span>{isCompleted ? "Launch Sandbox" : "Code Sandbox"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Immersive Code Sandbox Modal Overlay */}
      {activeSandboxProject && (
        <div className="project-sandbox-modal">
          <div className="sandbox-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="nav-brand-icon" style={{ width: '32px', height: '32px', borderRadius: '6px' }}>
                <Terminal size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', margin: 0 }}>SkillForge Code IDE v1.2</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                  Active Workspace: {activeSandboxProject.title} ({activeSandboxProject.difficulty})
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveSandboxProject(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="sandbox-twin-panels">
            {/* Left guidebook */}
            <div className="sandbox-left-guide glass-panel" style={{ padding: '20px', background: 'var(--bg-slate)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--accent)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Guidelines
              </h3>
              
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p>
                  <strong>Project Objective:</strong> Complete the functional backend endpoints or client interfaces to comply with modern standard requirements.
                </p>
                <div style={{ borderBottom: '1px solid var(--border-light)' }}></div>
                
                <h4 style={{ color: 'white', fontSize: '13px' }}>🎯 Engineering Requirements Checklist:</h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Code must maintain strict time complexity thresholds (O(N) operations max).</li>
                  <li>Incorporate structural encapsulation patterns (separate controllers or active state hooks).</li>
                  <li>Configure clean environment parameters and handle exception states beautifully.</li>
                </ul>

                <div style={{ borderBottom: '1px solid var(--border-light)', marginTop: '10px' }}></div>

                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                  <button 
                    className="btn-cyan animate-pulse" 
                    onClick={handleVerifySandboxCode}
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isCompiling}
                  >
                    {isCompiling ? "Compiling Project Sandbox..." : "Verify Code & Push Branch"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right mock code IDE and terminal logs */}
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
              {/* Code window */}
              <div className="sandbox-right-code">
                <textarea 
                  value={sandboxCode}
                  onChange={(e) => setSandboxCode(e.target.value)}
                  style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#a5b4fc', fontFamily: 'monospace', fontSize: '12.5px', resize: 'none', outline: 'none', lineHeight: '1.5' }}
                />
              </div>

              {/* Console log window */}
              <div style={{ height: '140px', background: '#03040a', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#10b981', overflowY: 'auto', lineHeight: '1.5' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '8px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>DEBUG CONSOLE LOGGER</span>
                  <span>BUILD SUCCESS RATE</span>
                </div>
                {consoleLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: '4px' }}>&gt; {log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
