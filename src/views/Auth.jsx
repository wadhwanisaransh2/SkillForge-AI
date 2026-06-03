import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Shield, Zap, Target, Users, Star } from 'lucide-react';

export default function Auth() {
  const { loginUser, registerUser } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    year: '3rd Year',
    targetRole: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        loginUser(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.email || !formData.college || !formData.targetRole || !formData.password) {
          throw new Error('Please fill in all required fields.');
        }
        registerUser({
          name: formData.name,
          email: formData.email,
          college: formData.college,
          degree: formData.degree || 'B.Tech Computer Science',
          year: formData.year,
          targetRole: formData.targetRole,
          careerGoal: `Pursuing a career as ${formData.targetRole}.`,
        }, formData.password);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setError(null);
    setLoading(true);
    try {
      loginUser('saransh@technonjr.org', 'demo1234');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const features = [
    { icon: <Zap size={16} />, text: 'AI-powered skill gap analysis' },
    { icon: <Target size={16} />, text: 'Personalized 8-week roadmaps' },
    { icon: <Users size={16} />, text: 'Live mock interviews & scoring' },
    { icon: <Star size={16} />, text: 'Resume ATS scanner & optimizer' },
  ];

  return (
    <div className="auth-view animate-fade-in">
      {/* ── Left Panel ── */}
      <div className="auth-split-left">
        <div className="auth-glow-orb auth-glow-orb-1"></div>
        <div className="auth-glow-orb auth-glow-orb-2"></div>

        <div className="auth-split-content">
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <div className="nav-brand-icon" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
              <Sparkles size={20} color="white" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              SkillForge AI
            </span>
          </div>

          <div className="auth-badge-pill" style={{ marginBottom: '24px' }}>
            <Sparkles size={13} />
            <span>National Hackathon Showcase 2026</span>
          </div>

          <h2 style={{ fontSize: '40px', fontWeight: '800', lineHeight: '1.15', marginBottom: '18px', color: 'var(--text-primary)' }}>
            From Degree <br />
            to <span className="gradient-text-neon">Dream Career</span>
          </h2>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '36px', maxWidth: '420px' }}>
            AI-powered career intelligence that bridges the gap between what you learned and what industry demands.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px', opacity: 0.7 }}>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              "SkillForge turned my CS degree into an actual industry portfolio in 8 weeks."
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '600' }}>
              — Sarah J., Software Engineer at TechGlobal
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-split-right">
        <div className="auth-form-card glass-panel">

          {/* One-click demo button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            style={{
              width: '100%',
              marginBottom: '24px',
              padding: '13px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              border: 'none',
              color: 'white',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 24px rgba(99,102,241,0.4)',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
              letterSpacing: '0.03em',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Zap size={16} fill="white" style={{ stroke: 'none' }} />
            ⚡ One-Click Judge Demo — Enter Dashboard
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              or {isLogin ? 'sign in manually' : 'create account'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px', marginBottom: '18px' }}>
              <Shield size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-form-header">
            <h3>{isLogin ? 'Welcome back' : 'Create your account'}</h3>
            <p>{isLogin ? 'Sign in to access your career dashboard.' : 'Join thousands of students building real careers.'}</p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            {!isLogin && (
              <>
                <div className="auth-input-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" className="auth-input" placeholder="e.g. Riya Sharma" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="auth-input-group">
                  <label>College / University *</label>
                  <input type="text" name="college" className="auth-input" placeholder="e.g. IIT Delhi" value={formData.college} onChange={handleChange} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '12px' }}>
                  <div className="auth-input-group">
                    <label>Degree</label>
                    <input type="text" name="degree" className="auth-input" placeholder="B.Tech CSE" value={formData.degree} onChange={handleChange} />
                  </div>
                  <div className="auth-input-group">
                    <label>Year</label>
                    <select name="year" className="auth-input" value={formData.year} onChange={handleChange} style={{ height: '45px', background: 'var(--bg-slate)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduated</option>
                    </select>
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>Target Role *</label>
                  <input type="text" name="targetRole" className="auth-input" placeholder="e.g. Full-Stack Developer" value={formData.targetRole} onChange={handleChange} required />
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label>Email Address *</label>
              <input type="email" name="email" className="auth-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="auth-input-group">
              <label>Password *</label>
              <input type="password" name="password" className="auth-input" placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'} value={formData.password} onChange={handleChange} required />
            </div>

            {isLogin && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '6px', padding: '8px 12px', marginBottom: '16px', lineHeight: '1.6' }}>
                🔑 Demo: <code style={{ color: 'var(--accent)' }}>saransh@technonjr.org</code> / <code style={{ color: 'var(--accent)' }}>demo1234</code>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setIsLogin(!isLogin); setError(null); setFormData({ name: '', email: '', college: '', degree: '', year: '3rd Year', targetRole: '', password: '' }); }}
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
            >
              {isLogin ? 'Sign Up Free' : 'Sign In'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
