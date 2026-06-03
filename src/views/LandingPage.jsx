import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles, ArrowRight, Cpu, GitMerge, Target,
  MessageSquareCode, FileText, Rocket, Star, Globe, Users, Award, Zap, CheckCircle2, Brain
} from 'lucide-react';

function useCountUp(end, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setValue(end); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end, duration]);
  return value;
}

export default function LandingPage() {
  const { setCurrentView, loginUser, currentView } = useApp();

  const students = useCountUp(12500);
  const skills = useCountUp(48000);
  const projects = useCountUp(9200);
  const startups = useCountUp(340);

  const handleLaunchDemo = () => {
    try { loginUser('saransh@technonjr.org', 'demo1234'); }
    catch { setCurrentView('dashboard'); }
  };

  const features = [
    { icon: Cpu, color: 'var(--primary)', title: 'AI Skill Gap Analysis', desc: 'Real-time Gemini AI scans your skills against live job market data and pinpoints exact gaps.', view: 'gap-analyzer' },
    { icon: GitMerge, color: 'var(--secondary)', title: 'Personalized Roadmaps', desc: 'Auto-generated 8-week learning paths mapped to your target role and skill level.', view: 'roadmap' },
    { icon: Target, color: 'var(--accent)', title: 'Industry Readiness Score', desc: 'A weighted composite score combining technical skills, projects, resume, and interview prep.', view: 'readiness' },
    { icon: MessageSquareCode, color: '#10b981', title: 'AI Mock Interviews', desc: 'Simulated technical and HR interview loops with instant performance breakdowns and tips.', view: 'mock-interview' },
    { icon: FileText, color: '#d97706', title: 'Resume ATS Scanner', desc: 'Laser-scans your resume for keyword gaps, formatting flaws, and ATS compatibility scores.', view: 'resume-analyzer' },
    { icon: Rocket, color: '#a855f7', title: 'Startup Launchpad', desc: 'Generate a complete Business Model Canvas, 12-week MVP roadmap and pitch deck via Gemini AI.', view: 'entrepreneur' },
  ];

  const handleFeatureClick = (view) => {
    try {
      loginUser('saransh@technonjr.org', 'demo1234');
      // loginUser sets view to 'dashboard', so we redirect to specific view
      setTimeout(() => setCurrentView(view), 50);
    } catch {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="landing-view animate-fade-in">
      <div className="glow-spot-1"></div>
      <div className="glow-spot-2"></div>

      {/* ─────────────── HERO ─────────────── */}
      <section className="landing-hero">
        <div className="hero-text">
          <div className="auth-badge-pill" style={{ marginBottom: '28px', display: 'inline-flex' }}>
            <Sparkles size={13} />
            <span>National Hackathon Showcase 2026</span>
          </div>

          <h1>
            Transform Your<br />
            <span className="gradient-text-neon">Degree Into a Career</span>
          </h1>

          <p>
            SkillForge AI is an intelligent career readiness platform that identifies your skill gaps, builds personalised roadmaps, coaches you through mock interviews, and validates your startup — all powered by Google Gemini.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => setCurrentView('auth')} style={{ padding: '14px 32px', fontSize: '15px' }}>
              Get Started Free <ArrowRight size={17} />
            </button>
            <button className="btn-secondary" onClick={handleLaunchDemo} style={{ padding: '14px 32px', fontSize: '15px', color: 'var(--accent)', borderColor: 'rgba(6,182,212,0.35)' }}>
              <Zap size={16} fill="currentColor" style={{ stroke: 'none' }} />
              Live Demo
            </button>
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '32px', flexWrap: 'wrap' }}>
            {[['✅', 'Google Gemini Powered'], ['🔒', 'Secure LocalStorage'], ['⚡', 'No Setup Required']].map(([icon, label]) => (
              <span key={label} style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{icon}</span> {label}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-graphics-container">
          <div className="hero-main-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#ef4444', '#eab308', '#22c55e'].map(c => (
                  <span key={c} style={{ width: '10px', height: '10px', background: c, borderRadius: '50%' }}></span>
                ))}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', letterSpacing: '0.05em' }}>SKILLFORGE ENGINE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="avatar-circle-sm" style={{ width: '44px', height: '44px', fontSize: '16px' }}>SW</div>
              <div>
                <h3 style={{ fontSize: '16px', margin: 0 }}>Saransh Wadhwani</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>B.Tech CSE · 4th Year</p>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-light)', marginBottom: '16px' }}></div>

            {[
              { label: 'Technical Readiness', val: 75, color: 'var(--primary)' },
              { label: 'Mock Interview Score', val: 68, color: 'var(--accent)' },
              { label: 'Project Completion', val: 55, color: 'var(--secondary)' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  <span>{label}</span>
                  <span style={{ color, fontWeight: '600' }}>{val}%</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`, borderRadius: '3px', transition: 'width 1.2s ease' }}></div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Python', 'React.js', 'Node.js'].map(s => (
                <span key={s} className="badge-glow" style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px' }}>{s}</span>
              ))}
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '3px 8px' }}>+2 more</span>
            </div>
          </div>

          <div className="hero-floating-stat top-left">
            <h4 style={{ fontSize: '14px', color: '#10b981', margin: 0 }}>⚡ 5 Day Streak</h4>
            <p style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '2px 0 0 0' }}>Daily Challenge</p>
          </div>

          <div className="hero-floating-stat bottom-right">
            <h4 style={{ fontSize: '14px', color: 'var(--secondary)', margin: 0 }}>🏆 Gap Solver</h4>
            <p style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '2px 0 0 0' }}>Badge Unlocked</p>
          </div>
        </div>
      </section>

      {/* ─────────────── STATS BAR ─────────────── */}
      <section className="landing-stats-section">
        <div className="landing-stats-wrapper">
          {[
            { value: students, label: 'Students Guided' },
            { value: skills, label: 'Skills Improved' },
            { value: projects, label: 'Projects Solved' },
            { value: startups, label: 'Startups Incubated' },
          ].map(({ value, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-item-number">{value.toLocaleString()}+</div>
              <div className="stat-item-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section className="landing-features">
        <div className="section-header">
          <div className="auth-badge-pill" style={{ background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.25)', color: '#22d3ee', marginBottom: '16px', display: 'inline-flex' }}>
            CORE CAPABILITIES
          </div>
          <h2>Everything You Need to Get Hired</h2>
          <p>Six AI-powered modules working together to close the gap between your degree and your dream job.</p>
        </div>

        <div className="features-grid">
          {features.map(({ icon: Icon, color, title, desc, view }) => (
            <div key={title} className="feature-card glass-card-interactive" onClick={() => handleFeatureClick(view)}>
              <div className="feature-icon-wrapper" style={{ background: `${color}18`, color }}>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '12px', color, fontWeight: '600' }}>
                <span>Explore feature</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="section-header" style={{ marginBottom: '50px' }}>
          <div className="auth-badge-pill" style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.25)', color: '#a5b4fc', marginBottom: '16px', display: 'inline-flex' }}>
            HOW IT WORKS
          </div>
          <h2>Three Steps to Career Clarity</h2>
          <p>From zero to placement-ready in a structured, AI-guided process.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Audit Your Skills', desc: 'Input your current skills and target role. Gemini AI instantly analyses your gaps against live market benchmarks.', color: 'var(--primary)' },
            { step: '02', title: 'Follow Your Roadmap', desc: 'Get a week-by-week curriculum with projects, tasks, and mock interviews tailored to close your specific gaps.', color: 'var(--accent)' },
            { step: '03', title: 'Get Placement-Ready', desc: 'Track your industry readiness score in real time. Unlock your verified certificate when you cross the 80% threshold.', color: 'var(--secondary)' },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="glass-panel" style={{ padding: '32px', border: `1px solid ${color}22`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '56px', fontWeight: '900', fontFamily: 'var(--font-heading)', color: `${color}18`, position: 'absolute', top: '12px', right: '16px', lineHeight: 1, userSelect: 'none' }}>{step}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: '20px' }}>
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── TESTIMONIALS ─────────────── */}
      <section className="landing-testimonials">
        <div className="section-header">
          <div className="auth-badge-pill" style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.25)', color: '#c084fc', marginBottom: '16px', display: 'inline-flex' }}>
            SUCCESS STORIES
          </div>
          <h2>Loved by Students & Institutions</h2>
          <p>Here's what graduates, placement officers, and hiring managers say.</p>
        </div>

        <div className="testimonials-grid">
          {[
            { initials: 'SJ', name: 'Sarah Jenkins', role: 'Software Engineer · TechGlobal', color: 'linear-gradient(135deg, var(--accent), var(--primary))', quote: '"The AI Gap Analyzer showed me exactly what I was missing. After following the 8-week roadmap and fixing my resume, I landed my first full-stack role in two months."' },
            { initials: 'RK', name: 'Dr. Rajesh Kumar', role: 'Dean of Placements · Techno NJR', color: 'linear-gradient(135deg, var(--primary), var(--secondary))', quote: '"Managing 2,000+ student profiles manually was impossible. SkillForge\'s Institution Dashboard lets us track departmental readiness and skill gaps in real time."' },
            { initials: 'MG', name: 'Marcus G.', role: 'Director of Talent · TechGlobal Inc.', color: 'linear-gradient(135deg, var(--secondary), var(--accent))', quote: '"Candidates trained on SkillForge show measurably stronger system design thinking and interview structure. It\'s the benchmark we now recommend to our campus partners."' },
          ].map(({ initials, name, role, color, quote }) => (
            <div key={name} className="testimonial-card glass-panel" style={{ border: '1px solid var(--border-light)' }}>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#fbbf24" style={{ stroke: 'none', marginRight: '2px' }} />)}
              </div>
              <p className="testimonial-quote">{quote}</p>
              <div className="testimonial-user">
                <div className="testimonial-user-avatar" style={{ background: color }}>{initials}</div>
                <div className="testimonial-user-info">
                  <h4>{name}</h4>
                  <p>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── CTA BANNER ─────────────── */}
      <section className="scalability-vision-section">
        <div className="scalability-banner glass-panel" style={{ textAlign: 'center', flexDirection: 'column', alignItems: 'center', padding: '64px 48px', border: '1px solid rgba(99,102,241,0.25)' }}>
          <div className="auth-badge-pill" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <Globe size={13} />
            <span>Built for Scale</span>
          </div>
          <h2 style={{ fontSize: '36px', maxWidth: '640px', margin: '0 auto 16px auto' }}>
            Ready to <span className="gradient-text-neon">forge your career?</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 36px auto', lineHeight: '1.7' }}>
            Join the platform trusted by students across 114 institutions. Your AI-powered career coach is waiting.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setCurrentView('auth')} style={{ padding: '14px 36px', fontSize: '15px' }}>
              Start for Free <ArrowRight size={17} />
            </button>
            <button className="btn-secondary" onClick={handleLaunchDemo} style={{ padding: '14px 36px', fontSize: '15px', color: 'var(--accent)', borderColor: 'rgba(6,182,212,0.3)' }}>
              <Brain size={16} /> Watch Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div className="nav-brand-icon" style={{ width: '28px', height: '28px', borderRadius: '7px' }}>
            <Sparkles size={14} color="white" />
          </div>
          <span style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SkillForge AI
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © 2026 SkillForge AI · National Hackathon Submission · Powered by Google Gemini 2.0 Flash
        </p>
      </footer>
    </div>
  );
}
