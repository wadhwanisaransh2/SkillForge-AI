import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, UploadCloud, Search, CheckCircle2, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';

export default function ResumeAnalyzer() {
  const {
    resumeData, setResumeData,
    skillScore, setSkillScore,
    studentProfile, setStudentProfile,
    addNotification,
    unlockBadge,
    pitchMode
  } = useApp();

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [logs, setLogs] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResumeFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processResumeFile(e.target.files[0].name);
    }
  };

  const processResumeFile = (name) => {
    setFileName(name);
    setUploading(true);
    setLogs([]);

    const steps = [
      "Injesting PDF layout binary streams...",
      "Executing OCR character scan parser...",
      "Auditing section formatting margins...",
      "Analyzing keyword weights for Software Engineer standard...",
      "Checking quantifiable accomplishment matrices...",
      "Compiling ATS score recommendations..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
      }, (idx + 1) * 350);
    });

    setTimeout(() => {
      setUploading(false);
      setResumeData({
        scanned: true,
        score: 65,
        weaknesses: [
          "Accomplishments are descriptive rather than quantitative. (e.g. lack of 'reduced latency by 20%')",
          "Project descriptions lack clear backend infrastructure markers."
        ],
        keywordsMissing: ["CI/CD Pipelines", "Docker Containers", "Jest Testing", "System Design"],
        atsMatch: "Moderate Compatibility (ATS Score 65/100)"
      });

      addNotification("📄 Resume scanner complete! parsed ATS Compatibility: 65%");
    }, 2400);
  };

  const handleAutoFixKeywords = () => {
    // Inject keywords into student skills
    const updatedSkills = [...new Set([...studentProfile.skills, "Jest Testing", "CI/CD", "Docker"])];
    setStudentProfile({
      ...studentProfile,
      skills: updatedSkills
    });

    setResumeData({
      ...resumeData,
      score: 88,
      keywordsMissing: ["System Design"],
      atsMatch: "High Compatibility (ATS Score 88/100)"
    });

    // Recalculate skill score
    setSkillScore(Math.min(100, skillScore + 12));
    
    addNotification("🚀 Auto-injected missing keywords: Jest, CI/CD, Docker into portfolio!");
    addNotification("📈 Skill Score increased to " + Math.min(100, skillScore + 12) + "%");
    unlockBadge("Resume Architect");
  };

  return (
    <div className="resume-analyzer-view animate-slide-up">
      {/* Pitch Mode Helper */}
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
          <div>
            <strong>Judge Presentation Tip</strong>: Demonstrate the **AI Resume Scanner**. 
            Drag in a dummy file or click to choose one. 
            This starts a dynamic holographic laser scanning animation and grades the template at **65/100**. 
            Click the glowing **"Auto-Inject Keywords"** button to simulate fixing the file. 
            This adds keywords to the student profile, boosts the dashboard's **Skill Score** instantly, and unlocks the **Resume Architect** badge!
          </div>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>AI Resume Scanner & Analyzer</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Evaluate your resume's formatting alignment and ATS keyword compatibility using advanced NLP parsers.
        </p>
      </div>

      <div className="resume-analyzer-workspace">
        {/* Left Upload panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            className="resume-drop-zone glass-panel"
            style={{ 
              border: dragActive ? '2px dashed var(--accent)' : '2px dashed rgba(99, 102, 241, 0.3)',
              background: dragActive ? 'rgba(6, 182, 212, 0.04)' : 'rgba(99, 102, 241, 0.02)',
              pointerEvents: uploading ? 'none' : 'auto'
            }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="resume-scanning-animation">
                <div className="resume-laser-scanner">
                  <div className="resume-laser-line"></div>
                  <FileText size={48} className="text-secondary" style={{ opacity: 0.2, margin: '50px auto 0 auto', display: 'block' }} />
                </div>
                <h4 style={{ fontSize: '15px', color: 'var(--accent)', animation: 'pulseParticle 1.5s infinite' }}>
                  ATS Scanner Active...
                </h4>
              </div>
            ) : (
              <>
                <UploadCloud size={44} className="resume-drop-icon" />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Drag & Drop Resume PDF</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    or click to search files (Max 5MB)
                  </p>
                </div>
                <input 
                  type="file" 
                  id="resume-file-inp" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.docx"
                />
                <button 
                  className="btn-cyan" 
                  style={{ padding: '8px 18px', fontSize: '12px' }}
                  onClick={() => document.getElementById('resume-file-inp').click()}
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          {fileName && (
            <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', border: '1px solid var(--border-light)' }}>
              <FileText size={18} className="text-cyan" />
              <span style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
            </div>
          )}

          {uploading && (
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(3, 4, 10, 0.8)', border: '1px solid var(--border-light)', fontFamily: 'monospace', fontSize: '11px', color: '#10b981', minHeight: '130px', maxHeight: '150px', overflowY: 'auto' }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '4px' }}>&gt; {log}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right Audit report */}
        <div className="analyzer-result-card glass-panel" style={{ border: '1px solid var(--border-light)', background: 'var(--bg-card)', padding: '30px' }}>
          {resumeData.scanned ? (
            <div className="resume-report-grid animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px' }}>ATS Calibration Analysis</h3>
                <span className="badge-glow" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                  {resumeData.atsMatch}
                </span>
              </div>

              {/* Score visualizer */}
              <div className="analyzer-score-meter">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 'bold', color: resumeData.score >= 80 ? '#10b981' : '#f59e0b' }}>
                  {resumeData.score}/100
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>ATS Matching Score</span>
                    <span>Ready Baseline: 80</span>
                  </div>
                  <div className="analyzer-score-bar-bg">
                    <div 
                      className="analyzer-score-bar-fill" 
                      style={{ 
                        width: `${resumeData.score}%`,
                        background: resumeData.score >= 80 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                        boxShadow: resumeData.score >= 80 ? '0 0 10px rgba(16,185,129,0.4)' : '0 0 10px rgba(6,182,212,0.4)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Missing keywords list */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '10px' }}>
                  <AlertTriangle size={16} />
                  <span>Missing Professional Keywords</span>
                </h4>
                {resumeData.keywordsMissing.length === 0 ? (
                  <p style={{ fontSize: '12.5px', color: '#34d399' }}>🎉 All core professional keywords are correctly configured in your resume!</p>
                ) : (
                  <>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      These high-frequency keywords were not detected but are required for high ATS compatibility:
                    </p>
                    <div className="analyzer-badge-grid">
                      {resumeData.keywordsMissing.map((kw, idx) => (
                        <span key={idx} className="badge-warning" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', border: '1px dashed var(--warning)' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Formatting errors weaknesses */}
              {resumeData.weaknesses.length > 0 && (
                <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '10px' }}>
                    <AlertTriangle size={16} />
                    <span>Layout & Accomplishment Flaws</span>
                  </h4>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {resumeData.weaknesses.map((weak, idx) => <li key={idx}>{weak}</li>)}
                  </ul>
                </div>
              )}

              {/* Sync buttons */}
              {resumeData.score < 80 && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn-cyan animate-pulse" 
                    onClick={handleAutoFixKeywords}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
                  >
                    <RefreshCw size={14} />
                    <span>Auto-Inject Missing Keywords</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              <FileText size={44} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>Drag in your PDF resume file to evaluate ATS standard indices and section keyword densities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
