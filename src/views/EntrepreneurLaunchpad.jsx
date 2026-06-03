import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Rocket, Target, DollarSign, Brain, Users, Compass, AlertCircle, Loader } from 'lucide-react';
import { generateBusinessCanvas } from '../services/geminiService';

export default function EntrepreneurLaunchpad() {
  const {
    startupIdea, setStartupIdea,
    entrepreneurScore, setEntrepreneurScore,
    addNotification,
    unlockBadge,
    pitchMode
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('canvas'); // canvas, mvp, pitch

  // Inputs
  const [formData, setFormData] = useState({
    name: 'EcoCampus Deliveries',
    problem: 'College students studying late at night have no access to fresh, healthy organic food options, forcing them to rely on unhealthy vending machines.',
    audience: 'Late-night studying university students and campus residents.'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [error, setError] = useState(null);

  const handleRunLaunchpad = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLogs([]);
    setError(null);

    const steps = [
      "Connecting to Gemini Incubator Intelligence Core...",
      "Analyzing market space for: " + formData.name + "...",
      "Validating problem statement and audience fit...",
      "Drafting customer persona profiles with AI...",
      "Mapping Business Model Canvas segments...",
      "Formulating 12-week MVP deployment timeline...",
      "Calculating viability and funding suitability..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
      }, (idx + 1) * 350);
    });

    try {
      const result = await generateBusinessCanvas(formData.name, formData.problem, formData.audience);

      setLoading(false);

      const parsedCanvas = {
        name: formData.name,
        problem: formData.problem,
        audience: formData.audience,
        valueProp: result.valueProp || "AI-powered solution for modern challenges.",
        segments: result.segments || formData.audience,
        channels: result.channels || "Mobile app, social media, college partnerships.",
        activities: result.activities || "Product development, user acquisition, partnerships.",
        partners: result.partners || "Academic institutions, industry mentors, investors.",
        costs: result.costs || "Development, marketing, and operations costs.",
        revenues: result.revenues || "Subscription, freemium upsells, enterprise licensing.",
        mvp: result.mvp || [
          { phase: "Weeks 1-2", task: "Market validation and landing page launch." },
          { phase: "Weeks 3-4", task: "Core feature MVP development." },
          { phase: "Weeks 5-8", task: "Beta testing with 50 early users." },
          { phase: "Weeks 9-12", task: "Iterate and prepare for public launch." }
        ],
        pitchSlides: result.pitchSlides || [],
        viability: result.viability || 72
      };

      setStartupIdea(parsedCanvas);
      setEntrepreneurScore(result.viability || 72);
      addNotification(`🚀 Gemini AI canvas compiled for "${formData.name}"! Viability: ${result.viability || 72}%`);
      unlockBadge('Founding Titan');
    } catch (err) {
      setLoading(false);
      setError('Gemini API error. Showing template canvas. (' + err.message + ')');
      // Graceful fallback
      const fallback = {
        name: formData.name, problem: formData.problem, audience: formData.audience,
        valueProp: "A campus-tailored solution addressing the identified problem with a data-driven approach.",
        segments: formData.audience,
        channels: "Progressive web app, social media channels, and campus partnerships.",
        activities: "Platform development, community building, and user acquisition.",
        partners: "Local businesses, college committees, and student organizations.",
        costs: "Development costs, infrastructure, and initial marketing spend.",
        revenues: "Subscription tiers, premium features, and institutional licensing.",
        mvp: [
          { phase: "Weeks 1-2", task: "User research surveys and landing page creation." },
          { phase: "Weeks 3-4", task: "MVP feature development and internal testing." },
          { phase: "Weeks 5-8", task: "Closed beta with 25 target users, gather feedback." },
          { phase: "Weeks 9-12", task: "Iterate on feedback and prepare public launch." }
        ],
        pitchSlides: [],
        viability: 70
      };
      setStartupIdea(fallback);
      setEntrepreneurScore(70);
      unlockBadge('Founding Titan');
    }
  };


  return (
    <div className="entrepreneur-launchpad-view animate-slide-up">
      {/* Pitch Mode Guidelines */}
      {pitchMode && !startupIdea && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
          <div>
            <strong>Judge Presentation Tip</strong>: Demonstrate the **Entrepreneur Launchpad**. 
            We have pre-filled a mock late-night campus snacks idea. 
            Click **"Formulate Business Canvas"** to simulate our startup incubator processor. 
            This dynamically builds a complete, high-fidelity **Business Model Canvas**, generates a **12-week MVP roadmap**, raises your **Incubator Score** in context, and awards you the **Founding Titan** badge!
          </div>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Entrepreneur Launchpad</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Evaluate raw business concepts, generate high-fidelity Business Model Canvases, and draft MVP rollout strategies.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel animate-slide-up" style={{ border: '1px solid var(--border-light)', padding: '60px 24px', textAlign: 'center' }}>
          <div className="loader-glow-ring" style={{ margin: '0 auto 20px auto' }}></div>
          <h3 style={{ fontSize: '20px', color: 'var(--accent)', animation: 'pulseParticle 1.5s infinite' }}>
            SkillForge Incubator Core Active...
          </h3>
          <div style={{ width: '100%', maxWidth: '340px', background: 'rgba(3, 4, 10, 0.85)', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '10px', height: '140px', overflowY: 'auto', textAlign: 'left', fontFamily: 'monospace', fontSize: '11px', color: '#10b981', margin: '20px auto 0 auto', lineHeight: '1.5' }}>
            {logs.map((log, idx) => <div key={idx} style={{ marginBottom: '6px' }}>&gt; {log}</div>)}
          </div>
        </div>
      ) : !startupIdea ? (
        // Input builder card
        <div className="entrepreneur-builder-card glass-panel animate-slide-up" style={{ border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Rocket size={18} className="text-secondary" />
            <span>Incubation Pitch Setup</span>
          </h3>

          <form onSubmit={handleRunLaunchpad}>
            <div className="launchpad-form-grid">
              <div className="auth-input-group full-span-field">
                <label htmlFor="startup-name-inp">Startup Name / Idea Name</label>
                <input 
                  type="text" 
                  id="startup-name-inp" 
                  name="name" 
                  className="auth-input" 
                  value={formData.name} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="auth-input-group full-span-field">
                <label htmlFor="problem-textarea">Problem Statement (What issue are you solving?)</label>
                <textarea 
                  id="problem-textarea" 
                  name="problem" 
                  className="interview-textarea" 
                  style={{ height: '90px' }}
                  value={formData.problem} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="auth-input-group full-span-field">
                <label htmlFor="audience-textarea">Target Customer Base (Who experiences this pain point?)</label>
                <textarea 
                  id="audience-textarea" 
                  name="audience" 
                  className="interview-textarea" 
                  style={{ height: '80px' }}
                  value={formData.audience} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '12px', color: '#f87171' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Rocket size={16} />}
              {loading ? ' Gemini Generating Canvas...' : ' Generate with Gemini AI'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Powered by Google Gemini 2.0 Flash
            </div>
          </form>
        </div>
      ) : (
        // Output view (Interactive Business Canvas)
        <div className="business-canvas-wrapper animate-slide-up">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', color: 'var(--accent)' }}>🚀 Startup Active Pitch: {startupIdea.name}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>AI Generated Incubation Blueprint • Viability: {startupIdea.viability}%</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setStartupIdea(null)} style={{ padding: '8px 16px', fontSize: '12px' }}>
                Refine Startup Concept
              </button>
              <button 
                className="btn-cyan" 
                onClick={() => alert("Simulation: Startup prospectus successfully printed and locked for incubation review!")} 
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Download Business Prospectus
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="projects-filter-bar" style={{ justifyContent: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px' }}>
            <button 
              className={`role-selector-btn ${activeTab === 'canvas' ? 'active' : ''}`}
              onClick={() => setActiveTab('canvas')}
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              Business Canvas
            </button>
            <button 
              className={`role-selector-btn ${activeTab === 'mvp' ? 'active' : ''}`}
              onClick={() => setActiveTab('mvp')}
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              12-Week MVP Path
            </button>
            <button 
              className={`role-selector-btn ${activeTab === 'pitch' ? 'active' : ''}`}
              onClick={() => setActiveTab('pitch')}
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              Incubator Pitch Outline
            </button>
          </div>

          {/* Canvas tab content */}
          {activeTab === 'canvas' && (
            <div className="canvas-board-grid">
              {/* Problem */}
              <div className="canvas-cell canvas-cell-vertical-2">
                <h4><AlertCircle size={14} /> 1. Core Problem</h4>
                <p>{startupIdea.problem}</p>
              </div>

              {/* Key Activities */}
              <div className="canvas-cell">
                <h4><Compass size={14} /> 4. Key Activities</h4>
                <p>{startupIdea.activities}</p>
              </div>

              {/* Value Proposition */}
              <div className="canvas-cell canvas-cell-vertical-2">
                <h4><Target size={14} /> 3. Value Proposition</h4>
                <p>{startupIdea.valueProp}</p>
              </div>

              {/* Channels */}
              <div className="canvas-cell">
                <h4><Compass size={14} /> 5. Channels</h4>
                <p>{startupIdea.channels}</p>
              </div>

              {/* Customer segments */}
              <div className="canvas-cell canvas-cell-vertical-2">
                <h4><Users size={14} /> 2. Customer Segments</h4>
                <p>{startupIdea.segments}</p>
              </div>

              {/* Key Partners */}
              <div className="canvas-cell">
                <h4><Users size={14} /> 6. Key Partners</h4>
                <p>{startupIdea.partners}</p>
              </div>

              {/* Customer Relations */}
              <div className="canvas-cell">
                <h4><Brain size={14} /> 7. Customer Relations</h4>
                <p>Campus referral models and instant WhatsApp delivery alert channels.</p>
              </div>

              {/* Cost Structure */}
              <div className="canvas-cell canvas-cell-horizontal-2">
                <h4><DollarSign size={14} /> 8. Cost Structure</h4>
                <p>{startupIdea.costs}</p>
              </div>

              {/* Revenue Streams */}
              <div className="canvas-cell canvas-cell-horizontal-2">
                <h4><DollarSign size={14} /> 9. Revenue Streams</h4>
                <p>{startupIdea.revenues}</p>
              </div>
            </div>
          )}

          {/* MVP Tab */}
          {activeTab === 'mvp' && (
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rocket size={18} className="text-secondary" />
                <span>12-Week Lean MVP Development Pipeline</span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {startupIdea.mvp.map((phase, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '20px', borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
                    <div style={{ minWidth: '100px', fontWeight: 'bold', color: 'var(--accent)' }}>
                      {phase.phase}
                    </div>
                    <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {phase.task}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pitch Outline tab */}
          {activeTab === 'pitch' && (
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} className="text-cyan" />
                <span>Gemini AI Pitch Deck Outline</span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {(startupIdea.pitchSlides && startupIdea.pitchSlides.length > 0
                  ? startupIdea.pitchSlides
                  : [
                      { slide: 'The Hook', content: `${startupIdea.name}: ${startupIdea.valueProp}` },
                      { slide: 'The Problem', content: startupIdea.problem },
                      { slide: 'The Solution', content: startupIdea.activities },
                      { slide: 'Revenue Model', content: startupIdea.revenues }
                    ]
                ).map((s, idx) => (
                  <div key={idx} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '14px' }}>
                    <strong style={{ color: 'white' }}>Slide {idx + 1}: {s.slide}</strong>
                    <p style={{ marginTop: '4px' }}>{s.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
