import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Lock, ChevronDown, ChevronUp, BookOpen, AlertCircle, Sparkles, Target, Loader, Map, RefreshCw, BarChart3, ChevronRight } from 'lucide-react';
import { generatePersonalizedRoadmap } from '../services/geminiService';

export default function RoadmapView() {
  const {
    roadmap,
    setRoadmap,
    toggleTask,
    pitchMode,
    studentProfile,
    gapAnalysis,
    setCurrentView,
    addNotification
  } = useApp();

  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  // Auto-expand the first active (unlocked, not completed) week on mount
  useEffect(() => {
    if (roadmap && roadmap.length > 0) {
      const activeIdx = roadmap.findIndex(w => !w.completed && !w.locked);
      const weekNum = activeIdx >= 0 ? roadmap[activeIdx].week : roadmap[0].week;
      setExpandedWeeks(prev => ({ ...prev, [weekNum]: true }));
    }
  }, []);

  const toggleExpand = (weekNum) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  // Generate AI roadmap on demand
  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const missingSkills = gapAnalysis?.missing?.length > 0
        ? gapAnalysis.missing
        : ['React.js', 'Node.js', 'Data Structures', 'System Design', 'Git & GitHub'];
      const existingSkills = gapAnalysis?.existing?.length > 0
        ? gapAnalysis.existing
        : (studentProfile.skills || ['Python', 'HTML', 'CSS']);
      const role = studentProfile.targetRole || 'Software Engineer';

      addNotification('🗺️ Generating your personalized roadmap via Gemini AI...');
      const newRoadmap = await generatePersonalizedRoadmap(missingSkills, role, existingSkills);
      setRoadmap(newRoadmap);
      // Auto-expand week 1
      setExpandedWeeks({ 1: true, 2: true });
      addNotification('✅ Personalized 8-week roadmap created based on your skill gaps!');
    } catch (err) {
      setGenError('Gemini API unreachable. Using default roadmap structure.');
      addNotification('⚠️ Could not generate AI roadmap — using standard template.');
    } finally {
      setGenerating(false);
    }
  };

  // Summary stats
  const totalTasks = roadmap ? roadmap.reduce((a, w) => a + w.tasks.length, 0) : 0;
  const completedTasks = roadmap ? roadmap.reduce((a, w) => a + w.tasks.filter(t => t.completed).length, 0) : 0;
  const completedWeeks = roadmap ? roadmap.filter(w => w.completed).length : 0;
  const totalWeeks = roadmap ? roadmap.length : 8;
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Empty state — no roadmap yet
  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="roadmap-view animate-slide-up">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Personalized Learning Roadmap</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Your AI-generated week-by-week curriculum tailored to close your specific career skill gaps.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <Map size={56} style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: '20px' }} />
          <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>No Roadmap Generated Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 28px auto', lineHeight: '1.7' }}>
            Run the <strong>AI Skill Gap Analyzer</strong> first to identify your skill gaps, then generate a personalized 8-week roadmap tailored to your target role.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setCurrentView('gap-analyzer')}>
              <Sparkles size={15} /> Run Gap Analysis First
            </button>
            <button className="btn-primary" onClick={handleGenerateRoadmap} disabled={generating}>
              {generating ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Map size={15} /> Generate Default Roadmap</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-view animate-slide-up">
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--warning)' }} />
          <div>
            <strong>Judge Tip</strong>: This roadmap is <strong>AI-personalized</strong> to your skill gaps.
            Click any unlocked week to expand tasks. Check tasks to mark completion — completing all tasks in a week <strong>auto-unlocks</strong> the next week!
            Use <strong>"Regenerate with AI"</strong> to create a fresh roadmap for a different role.
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Personalized Learning Roadmap</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            AI-configured curriculum for <strong style={{ color: 'var(--primary)' }}>{studentProfile.targetRole || 'your target role'}</strong> — {totalWeeks} weeks to placement readiness.
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={handleGenerateRoadmap}
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {generating
            ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Regenerating...</>
            : <><RefreshCw size={14} /> Regenerate with AI</>}
        </button>
      </div>

      {genError && (
        <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: 'var(--danger)' }}>
          ⚠️ {genError}
        </div>
      )}

      {/* Progress Dashboard */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Overall Progress</span>
              <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{overallPct}%</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-slate)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallPct}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '4px', transition: 'width 0.8s ease' }}></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Weeks Done', val: `${completedWeeks}/${totalWeeks}`, color: 'var(--success)' },
              { label: 'Tasks Done', val: `${completedTasks}/${totalTasks}`, color: 'var(--primary)' },
              { label: 'Status', val: overallPct >= 80 ? 'Job Ready! 🎉' : overallPct >= 50 ? 'Progressing 🔥' : 'Just Started 💪', color: overallPct >= 80 ? 'var(--success)' : overallPct >= 50 ? 'var(--warning)' : 'var(--accent)' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color, fontFamily: 'var(--font-heading)' }}>{val}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role context */}
        {gapAnalysis?.missing?.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>Skills this roadmap covers:</span>
            {gapAnalysis.missing.map(s => (
              <span key={s} className="badge-warning" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="roadmap-timeline">
        {roadmap.map((week, wIdx) => {
          const isCompleted = week.completed;
          const isActive = !week.completed && !week.locked;
          const isLocked = week.locked;
          const isExpanded = !!expandedWeeks[week.week];
          const weekPct = week.tasks.length > 0
            ? Math.round((week.tasks.filter(t => t.completed).length / week.tasks.length) * 100)
            : 0;

          let nodeClass = 'timeline-node';
          if (isCompleted) nodeClass += ' completed';
          else if (isActive) nodeClass += ' active';
          else if (isLocked) nodeClass += ' locked';

          return (
            <div key={week.week} className={nodeClass}>
              {/* Dot */}
              <div className="timeline-dot">
                {isCompleted
                  ? <Check size={12} style={{ strokeWidth: '3px', color: 'var(--success)' }} />
                  : isActive
                    ? <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }}></span>
                    : <Lock size={10} style={{ color: '#94a3b8' }} />}
              </div>

              {/* Card */}
              <div
                className="timeline-card glass-panel"
                style={{
                  border: isActive
                    ? '1px solid rgba(8,145,178,0.35)'
                    : isCompleted
                      ? '1px solid rgba(5,150,105,0.25)'
                      : '1px solid var(--border-light)',
                  boxShadow: isActive ? '0 6px 24px rgba(8,145,178,0.1)' : 'var(--glass-shadow)',
                  opacity: isLocked ? 0.55 : 1
                }}
              >
                {/* Card Header */}
                <div
                  className="timeline-card-header"
                  onClick={() => !isLocked && toggleExpand(week.week)}
                  style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h3 style={{
                        color: isActive ? 'var(--accent)' : isCompleted ? 'var(--success)' : 'var(--text-primary)',
                        fontSize: '16px'
                      }}>
                        Week {week.week}: {week.title}
                      </h3>
                      {isCompleted && (
                        <span className="badge-success" style={{ fontSize: '10px', padding: '2px 10px', borderRadius: '12px', fontWeight: '700' }}>
                          ✓ Complete
                        </span>
                      )}
                      {isActive && (
                        <span style={{ fontSize: '10px', padding: '2px 10px', borderRadius: '12px', fontWeight: '700', background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.3)', color: 'var(--accent)' }}>
                          ⚡ Active
                        </span>
                      )}
                      {isLocked && (
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>🔒 Locked</span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: !isLocked ? '10px' : 0 }}>
                      {week.description}
                    </p>

                    {/* Mini progress for active/completed weeks */}
                    {!isLocked && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '4px', background: 'var(--bg-slate)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${weekPct}%`, background: isCompleted ? 'var(--success)' : 'var(--primary)', transition: 'width 0.6s ease', borderRadius: '2px' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: isCompleted ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {week.tasks.filter(t => t.completed).length}/{week.tasks.length} tasks
                        </span>
                      </div>
                    )}
                  </div>
                  {!isLocked && (
                    <div style={{ color: 'var(--text-secondary)', paddingLeft: '16px', flexShrink: 0 }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && !isLocked && (
                  <div className="timeline-expanded-content">
                    {/* Topics */}
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <BookOpen size={13} /> Topics Covered
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {week.topics.map((topic, tIdx) => (
                          <span key={tIdx} className="badge-glow" style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px' }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Task Checklist */}
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        📋 Task Checklist
                      </div>
                      <div className="timeline-tasks-checklist">
                        {week.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`timeline-task-row ${task.completed ? 'checked' : ''}`}
                            onClick={() => toggleTask(wIdx, task.id)}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                          >
                            <div className="timeline-task-checkbox">
                              {task.completed && <Check size={12} style={{ strokeWidth: '3px' }} />}
                            </div>
                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                              {task.text}
                            </span>
                            {task.completed && (
                              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>Done ✓</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Week completion message */}
                      {week.tasks.length > 0 && week.tasks.every(t => t.completed) && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: '8px', fontSize: '13px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Check size={15} /> All tasks complete! Next week will be unlocked automatically.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      {completedWeeks === totalWeeks && (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', marginTop: '24px', border: '1px solid rgba(5,150,105,0.3)', background: 'rgba(5,150,105,0.04)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <h3 style={{ fontSize: '24px', color: 'var(--success)', marginBottom: '8px' }}>Roadmap Complete!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            You've completed all {totalWeeks} weeks. Check your Industry Readiness Score!
          </p>
          <button className="btn-primary" onClick={() => setCurrentView('readiness')}>
            View Readiness Score <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
