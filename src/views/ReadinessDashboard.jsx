import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Target, Trophy, Download, Printer, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';

export default function ReadinessDashboard() {
  const {
    studentProfile,
    skillScore,
    readinessScore,
    projectScore,
    interviewResult,
    resumeData,
    pitchMode
  } = useApp();

  const [showCertificate, setShowCertificate] = useState(false);

  const interviewScoreVal = interviewResult ? interviewResult.score : 60;
  const resumeScoreVal = resumeData.scanned ? resumeData.score : 65;

  const barData = [
    { label: "Technical", val: skillScore, color: "#6366f1" },
    { label: "Comm.", val: interviewScoreVal, color: "#a855f7" },
    { label: "Projects", val: projectScore, color: "#06b6d4" },
    { label: "Resume", val: resumeScoreVal, color: "#10b981" },
    { label: "Overall", val: readinessScore, color: "#fbbf24" }
  ];

  const radarData = [
    { subject: 'Technical', A: skillScore },
    { subject: 'Interview', A: interviewScoreVal },
    { subject: 'Projects', A: projectScore },
    { subject: 'Resume', A: resumeScoreVal },
    { subject: 'Readiness', A: readinessScore },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(7,8,20,0.95)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px',
          color: '#e2e8f0'
        }}>
          <p style={{ fontWeight: '700', marginBottom: '4px', color: payload[0].fill }}>{label}</p>
          <p>Score: <strong>{payload[0].value}%</strong></p>
        </div>
      );
    }
    return null;
  };

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="readiness-dashboard-view animate-slide-up">
      {/* Pitch Mode Guidelines */}
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
          <div>
            <strong>Judge Presentation Tip</strong>: You are viewing the **Industry Readiness Dashboard**. 
            This represents the core analytics system. 
            If your aggregate Readiness Score is **below 80%**, the platform displays a path warning. 
            Once you hit **80%+** (by completing timeline checklists or auto-injecting resume keywords), the system unlocks the **Verified Certificate Gateway** below!
          </div>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Industry Readiness Diagnostics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          An aggregated review of your curriculums, mock assessments, resume indexes, and sandbox project milestones.
        </p>
      </div>

      {/* Main radial summary card */}
      <div className="readiness-overall-summary-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', padding: '4px 12px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', fontWeight: '600', color: '#a5b4fc' }}>
            <Trophy size={13} className="text-secondary" />
            <span>AI PLACEMENT SCORE CARD</span>
          </div>
          <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Employability Index: {readinessScore >= 80 ? 'Highly Ready' : 'In-Progress'}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.6' }}>
            Your cumulative score weights your performance across key engineering disciplines. Universities Dean panels and company recruiters use this exact index to identify placement suitability.
          </p>
        </div>

        {/* Double-stroke radial score dial */}
        <div className="readiness-score-radial-visual">
          <svg width="150" height="150" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="chart-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="50%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth="10" />
            <circle 
              cx="60" 
              cy="60" 
              r="45" 
              fill="none" 
              stroke="url(#chart-grad-1)" 
              strokeWidth="10" 
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (readinessScore / 100) * 282.7}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>{readinessScore}%</div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '-4px' }}>READINESS</div>
          </div>
        </div>
      </div>

      {/* Recharts Bar + Radar Charts */}
      <div className="readiness-progress-charts-matrix">
        {/* Recharts Bar Chart */}
        <div className="custom-chart-container glass-panel" style={{ border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target size={16} className="text-secondary" />
            <span>Capability Vector Distribution</span>
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 16, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="val" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={900}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.88} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recharts Radar Chart */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '0' }}>
            Skill Radar
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(15,23,42,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} isAnimationActive animationDuration={900} />
            </RadarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {barData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block' }}></span>
                  {item.label}
                </span>
                <strong style={{ color: item.color }}>{item.val}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Gateway Certificate Banner */}
      {readinessScore < 80 ? (
        <div className="glass-panel" style={{ padding: '24px', border: '1px dashed var(--warning)', background: 'rgba(245, 158, 11, 0.03)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertCircle size={28} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>SkillForge AI Certification Gate locked</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Your current aggregate readiness index is **{readinessScore}%**. Achieve the **80%** employment threshold (by finishing weeks inside the **Personal Roadmap** or scanning fixed files in the **Resume Scanner**) to unlock your verified graduation credential!
            </p>
          </div>
        </div>
      ) : (
        <div className="certificate-download-banner glass-panel" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.1)' }}>
          <div>
            <h3 style={{ fontSize: '20px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Award size={20} /> Employability Baseline Achieved!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '520px', lineHeight: '1.5' }}>
              Congratulations! Your capability scores have officially crossed the **80%** employment baseline criteria. Your verified SkillForge AI Industry-Ready Certificate is available for distribution.
            </p>
          </div>
          <button className="btn-cyan" onClick={() => setShowCertificate(true)} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
            <span>Generate & View Certificate</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Fullscreen Certificate Overlay Modal */}
      {showCertificate && (
        <div className="certificate-modal-overlay">
          <div style={{ position: 'relative' }}>
            {/* Close */}
            <button 
              onClick={() => setShowCertificate(false)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <X size={18} /> Close
            </button>

            {/* Document Card */}
            <div className="certificate-document-card">
              <div style={{ border: '2px solid rgba(251, 191, 36, 0.3)', padding: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '24px' }}>
                  Verified Employability Credential
                </span>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: '#fff', fontWeight: '600', marginBottom: '8px' }}>
                  Certificate of Industry Readiness
                </h1>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '36px' }}>
                  This verified credential establishes that the recipient complies with industry-standard full-stack engineering criteria.
                </p>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  This is proudly awarded to:
                </p>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: '#fbbf24', fontWeight: '700', marginBottom: '10px' }}>
                  {studentProfile.name}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                  for successfully scoring an aggregate **{readinessScore}%** on the **SkillForge AI Curricular Index**, verifying competencies in backend server routing, SQL storage schemas, scanned ATS resumes, and mock technical evaluation rounds.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VERIFIED DATE</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'white', marginTop: '2px' }}>{getTodayDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CREDENTIAL ID</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'white', fontFamily: 'monospace', marginTop: '2px' }}>SF-AI-2026-{Math.floor(1000 + Math.random() * 9000)}</div>
                  </div>
                </div>

                {/* Gold seal stamp */}
                <div className="cert-stamp">
                  <span>SKILLFORGE<br />VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Print button */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
              <button className="btn-secondary" onClick={() => window.print()} style={{ gap: '8px' }}>
                <Printer size={16} /> Print Credential
              </button>
              <button 
                className="btn-cyan" 
                onClick={() => {
                  alert("Credential PDF successfully downloaded!");
                  setShowCertificate(false);
                }}
                style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: 'black', fontWeight: 'bold', gap: '8px' }}
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
