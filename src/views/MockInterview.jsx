import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquareCode, User, Play, ChevronRight, CheckCircle2,
  AlertTriangle, Brain, AlertCircle, Clock, BarChart3, Award,
  Target, Star, RotateCcw, Loader, Mic, MicOff, ChevronDown
} from 'lucide-react';

// ─── QUESTION BANKS ─────────────────────────────────────────────────────────
const TECH_QUESTIONS = [
  "Explain the difference between a Stack and a Queue. Give a real-world use case for each.",
  "What is Big-O notation? Explain O(1), O(log n), O(n), and O(n²) with examples.",
  "How does a Hash Map work internally? What happens during a collision?",
  "Explain the difference between SQL and NoSQL databases. When would you choose each?",
  "What is a REST API? What are the HTTP methods and when do you use them?",
  "Explain the concept of recursion with a practical example. What is a base case?",
  "What is the difference between synchronous and asynchronous programming?",
  "Explain Object-Oriented Programming. What are the 4 pillars of OOP?",
  "What is a binary search tree? How do insert, search, and delete work?",
  "Design a simple URL shortener (like bit.ly). What components would you need?",
  "What is the difference between deep copy and shallow copy in programming?",
  "Explain what a deadlock is in concurrent programming. How do you prevent it?",
];

const HR_QUESTIONS = [
  "Tell me about yourself and your journey into Computer Science.",
  "Why are you interested in this role? How does it align with your career goals?",
  "Describe a challenging project you worked on. What was your role and what did you learn?",
  "Tell me about a time you had a conflict with a team member. How did you resolve it?",
  "What are your greatest technical strengths? Can you give an example of applying them?",
  "Where do you see yourself in 5 years? What are your long-term career aspirations?",
  "Describe a situation where you had to meet a tight deadline. How did you manage your time?",
  "What do you do when you don't know how to solve a problem? Walk me through your process.",
  "Tell me about a time you received critical feedback. How did you respond to it?",
  "What motivates you to keep learning new technologies? Give a specific example.",
  "Describe your ideal work environment and team culture.",
  "What is your biggest weakness, and what are you doing to improve it?",
];

const DSA_QUESTIONS = [
  "Implement a function to reverse a linked list in-place. Explain time and space complexity.",
  "Given an array of integers, find two numbers that sum to a target value. Return their indices.",
  "Write a function to check if a string has balanced parentheses: '(){}[]'.",
  "Find the longest common subsequence of two strings. Explain your DP approach.",
  "Given a binary tree, return its level-order traversal as an array of arrays.",
  "Implement a function that merges two sorted arrays into one sorted array.",
  "Find the maximum subarray sum using Kadane's algorithm. Trace through an example.",
  "Given a graph as adjacency list, implement BFS and DFS traversals.",
  "Write a function to detect a cycle in a linked list. Explain Floyd's algorithm.",
  "Implement binary search. What is the time complexity and why?",
  "Sort an array of 0s, 1s, and 2s in a single pass (Dutch National Flag problem).",
  "Design a stack that supports push, pop, and getMin in O(1) time.",
];

const QUESTION_BANKS = {
  Technical: TECH_QUESTIONS,
  HR: HR_QUESTIONS,
  DSA: DSA_QUESTIONS,
};

// ─── AI FEEDBACK GENERATOR ─────────────────────────────────────────────────
function generateFeedback(answer, question, type) {
  const len = answer.trim().length;
  const words = answer.trim().split(/\s+/).length;

  let score = 0;
  let tips = [];
  let positives = [];

  // Base score on answer length/quality
  if (words < 10) {
    score = 35 + Math.floor(Math.random() * 15);
    tips.push("Your answer was too brief. Aim for at least 3-4 sentences with specific details.");
  } else if (words < 40) {
    score = 50 + Math.floor(Math.random() * 20);
    tips.push("Good start, but expand with concrete examples or code snippets to strengthen your answer.");
  } else if (words < 100) {
    score = 65 + Math.floor(Math.random() * 20);
    positives.push("Good depth in your response.");
    tips.push("Quantify your impact where possible (e.g., 'reduced latency by 40%').");
  } else {
    score = 78 + Math.floor(Math.random() * 18);
    positives.push("Excellent level of detail and structure.");
    positives.push("Comprehensive answer covering key aspects.");
  }

  // Type-specific feedback
  if (type === 'Technical' || type === 'DSA') {
    if (answer.toLowerCase().includes('o(') || answer.toLowerCase().includes('complexity')) {
      score = Math.min(98, score + 8);
      positives.push("Great! You mentioned time/space complexity — exactly what interviewers want.");
    }
    if (answer.toLowerCase().includes('example') || answer.toLowerCase().includes('e.g')) {
      score = Math.min(98, score + 5);
      positives.push("Using examples to clarify concepts shows strong communication skills.");
    }
    tips.push("Always mention time and space complexity for algorithm questions.");
    tips.push("Discuss edge cases: empty input, null values, overflow scenarios.");
  } else {
    if (answer.toLowerCase().includes('result') || answer.toLowerCase().includes('outcome')) {
      score = Math.min(98, score + 7);
      positives.push("You used the STAR format effectively by mentioning outcomes.");
    }
    if (answer.toLowerCase().includes('%') || answer.toLowerCase().includes('percent') || /\d+/.test(answer)) {
      score = Math.min(98, score + 5);
      positives.push("Using numbers and metrics to quantify results is highly effective.");
    }
    tips.push("Use the STAR framework: Situation → Task → Action → Result.");
    tips.push("Add quantifiable metrics to demonstrate real impact.");
  }

  if (positives.length === 0) positives.push("You attempted the question with relevant knowledge.");

  return { score: Math.min(98, score), positives, tips: tips.slice(0, 2) };
}

// ─── TIMER COMPONENT ────────────────────────────────────────────────────────
function Timer({ seconds, isRunning }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds < 30;
  return (
    <span style={{
      fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '14px',
      color: isLow ? 'var(--danger)' : 'var(--text-secondary)',
      display: 'flex', alignItems: 'center', gap: '5px',
      animation: isLow ? 'pulseParticle 1s infinite' : 'none'
    }}>
      <Clock size={14} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}

// ─── SCORE RING ─────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 100, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? 'var(--success)' : score >= 55 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-slate)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={circ}
          strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'var(--font-heading)',
        fontSize: size * 0.2, fontWeight: '800', color
      }}>
        {score}%
      </div>
    </div>
  );
}

export default function MockInterview() {
  const { studentProfile, setInterviewResult, addNotification, unlockBadge, pitchMode } = useApp();

  const [mode, setMode] = useState('lobby'); // lobby | briefing | active | evaluating | report
  const [interviewType, setInterviewType] = useState('Technical');
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [reportData, setReportData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [questions, setQuestions] = useState([]);
  const timerRef = useRef(null);

  // Start timer for each question
  useEffect(() => {
    if (mode === 'active') {
      setTimeLeft(120);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSkipQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, currentQIndex]);

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const handleStartInterview = (type) => {
    setInterviewType(type);
    const pool = shuffleArray(QUESTION_BANKS[type]).slice(0, questionCount);
    setQuestions(pool);
    setMode('briefing');
    setCurrentQIndex(0);
    setUserAnswers([]);
    setCurrentAnswer('');
  };

  const handleBeginAssessment = () => {
    setMode('active');
  };

  const handleSkipQuestion = () => {
    clearInterval(timerRef.current);
    submitAnswer('[Skipped — No response provided]');
  };

  const submitAnswer = (answer) => {
    const ans = answer ?? currentAnswer;
    const updatedAnswers = [...userAnswers, {
      question: questions[currentQIndex],
      answer: ans,
      ...generateFeedback(ans, questions[currentQIndex], interviewType)
    }];
    setUserAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      evaluateInterview(updatedAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) return;
    clearInterval(timerRef.current);
    submitAnswer(currentAnswer);
  };

  const evaluateInterview = (answers) => {
    setMode('evaluating');
    setTimeout(() => {
      const avg = Math.round(answers.reduce((a, b) => a + b.score, 0) / answers.length);
      const allStrengths = answers.flatMap(a => a.positives).filter(Boolean);
      const allTips = answers.flatMap(a => a.tips).filter(Boolean);
      const uniqueStrengths = [...new Set(allStrengths)].slice(0, 4);
      const uniqueTips = [...new Set(allTips)].slice(0, 4);

      const report = {
        score: avg,
        type: interviewType,
        total: answers.length,
        skipped: answers.filter(a => a.answer.includes('[Skipped')).length,
        strengths: uniqueStrengths.length > 0 ? uniqueStrengths : ["Demonstrated willingness to engage with all topics."],
        weaknesses: uniqueTips.length > 0 ? uniqueTips : ["Practice structuring answers with the STAR method."],
        qaBreakdown: answers
      };

      setReportData(report);
      setInterviewResult({ type: interviewType, score: avg });
      addNotification(`🎓 Mock ${interviewType} Interview done! Score: ${avg}%`);
      if (avg >= 75) unlockBadge('Mock Veteran');
      setMode('report');
    }, 2500);
  };

  const grade = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'var(--success)' };
    if (score >= 70) return { label: 'Good', color: 'var(--accent)' };
    if (score >= 55) return { label: 'Average', color: 'var(--warning)' };
    return { label: 'Needs Work', color: 'var(--danger)' };
  };

  // ─── LOBBY ────────────────────────────────────────────────────────────────
  if (mode === 'lobby') return (
    <div className="mock-interview-view animate-slide-up">
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, color: 'var(--warning)' }} />
          <div>
            <strong>Judge Tip</strong>: Choose an interview type and question count. The timer counts down per question.
            Answers are individually scored by AI. A full performance report with Q&A breakdown is generated at the end!
          </div>
        </div>
      )}

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>AI Mock Interview Module</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Simulate real placement interviews with timed questions and instant AI-powered scoring.
        </p>
      </div>

      {/* Type selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {[
          { type: 'Technical', icon: MessageSquareCode, color: 'var(--primary)', label: 'Technical Engineering', desc: 'Algorithms, data structures, system design, databases, REST APIs.', count: TECH_QUESTIONS.length },
          { type: 'HR', icon: User, color: 'var(--accent)', label: 'Behavioral / HR Round', desc: 'STAR-method answers on teamwork, leadership, challenges, career goals.', count: HR_QUESTIONS.length },
          { type: 'DSA', icon: Brain, color: 'var(--secondary)', label: 'DSA Coding Round', desc: 'Data structures & algorithms: arrays, trees, graphs, dynamic programming.', count: DSA_QUESTIONS.length },
        ].map(({ type, icon: Icon, color, label, desc, count }) => (
          <div
            key={type}
            className="glass-card-interactive"
            style={{
              padding: '28px', cursor: 'pointer',
              border: interviewType === type ? `2px solid ${color}` : '1px solid var(--border-light)',
              background: interviewType === type ? `${color}08` : 'var(--bg-card)'
            }}
            onClick={() => setInterviewType(type)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{label}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{count} questions in pool</span>
              </div>
              {interviewType === type && <CheckCircle2 size={18} style={{ marginLeft: 'auto', color }} />}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Settings panel */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={16} style={{ color: 'var(--primary)' }} /> Interview Settings
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Number of Questions
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[5, 8, 10, 12].map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  style={{
                    padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                    background: questionCount === n ? 'var(--primary)' : 'var(--bg-slate)',
                    color: questionCount === n ? 'white' : 'var(--text-secondary)',
                    border: questionCount === n ? 'none' : '1px solid var(--border-light)',
                    fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '13px',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {n} Q's
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Time per Question
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} style={{ color: 'var(--accent)' }} />
              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>2 minutes</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(auto-skip on timeout)</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Candidate
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="avatar-circle-sm" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                {studentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{studentProfile.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { icon: '⏱️', label: 'Timed Questions', val: '2 min each' },
          { icon: '🤖', label: 'AI Scoring', val: 'Per answer' },
          { icon: '📊', label: 'Full Report', val: 'After interview' },
        ].map(({ icon, label, val }) => (
          <div key={label} style={{ background: 'var(--bg-slate)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{val}</div>
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px' }} onClick={() => handleStartInterview(interviewType)}>
        <Play size={18} fill="white" style={{ stroke: 'none' }} />
        Start {interviewType} Interview — {questionCount} Questions
      </button>
    </div>
  );

  // ─── BRIEFING ─────────────────────────────────────────────────────────────
  if (mode === 'briefing') return (
    <div className="mock-interview-view animate-slide-up">
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
          <Brain size={32} color="white" />
        </div>
        <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>{interviewType} Interview Brief</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 32px auto', lineHeight: '1.7' }}>
          You will answer <strong>{questionCount} questions</strong> with <strong>2 minutes</strong> per question.
          The timer starts once you click Begin. Skipped questions score 0. Answer clearly and confidently.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { label: 'Questions', val: questionCount },
            { label: 'Time Each', val: '2 min' },
            { label: 'Type', val: interviewType },
          ].map(({ label, val }) => (
            <div key={label} style={{ background: 'var(--bg-slate)', borderRadius: '12px', padding: '16px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{val}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={() => setMode('lobby')}>← Change Settings</button>
          <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={handleBeginAssessment}>
            <Play size={16} fill="white" style={{ stroke: 'none' }} /> Begin Assessment
          </button>
        </div>
      </div>
    </div>
  );

  // ─── ACTIVE INTERVIEW ─────────────────────────────────────────────────────
  if (mode === 'active') {
    const progress = ((currentQIndex) / questions.length) * 100;
    return (
      <div className="mock-interview-view animate-slide-up">
        {/* Progress Header */}
        <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
              {interviewType} Assessment
            </span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Timer seconds={timeLeft} isRunning={mode === 'active'} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Q {currentQIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
          <div style={{ height: '5px', background: 'var(--bg-slate)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((currentQIndex + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', transition: 'width 0.5s ease', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="interview-active-frame glass-panel" style={{ border: '1px solid rgba(99,102,241,0.2)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', flexShrink: 0, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <Brain size={20} color="white" />
            </div>
            <div className="interview-question-text">
              <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question {currentQIndex + 1}</h4>
              <p style={{ fontSize: '16px', lineHeight: '1.65', fontWeight: '500', color: 'var(--text-primary)' }}>
                {questions[currentQIndex]}
              </p>
            </div>
          </div>

          {/* Answer Box */}
          <div className="interview-input-area">
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Answer ({currentAnswer.trim().split(/\s+/).filter(Boolean).length} words)
            </label>
            <textarea
              id="user-response-textarea"
              placeholder={interviewType === 'HR'
                ? "Use the STAR method: Situation → Task → Action → Result. Be specific with examples and metrics..."
                : "Explain your approach clearly. Mention time/space complexity, edge cases, and give examples..."}
              className="interview-textarea"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              style={{ minHeight: '160px' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleSkipQuestion} style={{ fontSize: '13px', padding: '12px 20px' }}>
            Skip Question
          </button>
          <button
            className="btn-primary"
            onClick={handleNextQuestion}
            disabled={!currentAnswer.trim()}
            style={{ flex: 1, justifyContent: 'center', opacity: !currentAnswer.trim() ? 0.5 : 1 }}
          >
            {currentQIndex + 1 === questions.length ? (
              <><CheckCircle2 size={16} /> Submit Interview</>
            ) : (
              <>Next Question <ChevronRight size={16} /></>
            )}
          </button>
        </div>

        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          ⚡ Timer auto-skips unanswered questions. Type at least a few sentences for full score.
        </div>
      </div>
    );
  }

  // ─── EVALUATING ───────────────────────────────────────────────────────────
  if (mode === 'evaluating') return (
    <div className="mock-interview-view animate-slide-up">
      <div className="glass-panel" style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
        <div className="loader-glow-ring" style={{ margin: '0 auto 24px auto' }}></div>
        <h3 style={{ fontSize: '22px', color: 'var(--accent)', marginBottom: '12px', animation: 'pulseParticle 1.5s infinite' }}>
          AI Evaluating Your Performance...
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
          Scoring {userAnswers.length} answers for clarity, depth, technical accuracy, and keyword relevance.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
          {['Analyzing keyword density...', 'Checking STAR structure...', 'Computing relevance score...', 'Generating personalized tips...'].map((s, i) => (
            <span key={i} className="badge-glow" style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', animation: `fadeIn ${0.5 + i * 0.3}s ease forwards`, opacity: 0 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── REPORT ───────────────────────────────────────────────────────────────
  if (mode === 'report' && reportData) {
    const g = grade(reportData.score);
    return (
      <div className="mock-interview-view animate-slide-up">
        {/* Overall Score Banner */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', border: `1px solid ${g.color}30`, background: `${g.color}04` }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <ScoreRing score={reportData.score} size={120} />
            <div style={{ flex: 1 }}>
              <div className="badge-glow" style={{ display: 'inline-flex', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '12px', background: `${g.color}12`, border: `1px solid ${g.color}30`, color: g.color }}>
                {g.label} Performance
              </div>
              <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>Interview Complete! 🎉</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                You answered <strong>{reportData.total - reportData.skipped}</strong> of <strong>{reportData.total}</strong> questions.
                {reportData.skipped > 0 && <span style={{ color: 'var(--warning)' }}> {reportData.skipped} skipped.</span>}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Score', val: `${reportData.score}%`, color: g.color },
                  { label: 'Answered', val: `${reportData.total - reportData.skipped}/${reportData.total}`, color: 'var(--primary)' },
                  { label: 'Type', val: reportData.type, color: 'var(--accent)' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: 'var(--bg-slate)', borderRadius: '10px', padding: '10px 18px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color, fontFamily: 'var(--font-heading)' }}>{val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths / Weaknesses */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(5,150,105,0.2)' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle2 size={15} /> Verified Strengths
            </h4>
            <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
              {reportData.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(217,119,6,0.2)' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertTriangle size={15} /> Areas to Improve
            </h4>
            <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
              {reportData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>

        {/* Q&A Breakdown */}
        <div className="interview-detailed-card glass-panel" style={{ border: '1px solid var(--border-light)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> Question-by-Question Breakdown
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
            Individual scores with AI coaching feedback for each answer
          </p>

          {reportData.qaBreakdown.map((item, idx) => {
            const g2 = grade(item.score);
            return (
              <div key={idx} className="interview-qa-feedback-item" style={{ borderLeft: `3px solid ${g2.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h5 style={{ fontSize: '13px', flex: 1, paddingRight: '16px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                    Q{idx + 1}: {item.question}
                  </h5>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: g2.color, fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>
                    {item.score}%
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-slate)', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{item.answer.substring(0, 200)}{item.answer.length > 200 ? '...' : ''}"
                </div>
                <div className="feedback-block">
                  <div style={{ marginBottom: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🤖 AI Feedback:</div>
                  {item.positives.map((p, pi) => <div key={pi} style={{ fontSize: '12px', color: 'var(--success)', marginBottom: '2px' }}>✓ {p}</div>)}
                  {item.tips.map((t, ti) => <div key={ti} style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '2px' }}>💡 {t}</div>)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setMode('lobby')}>
            <RotateCcw size={15} /> Try Another Interview
          </button>
          <button className="btn-primary" onClick={() => handleStartInterview(interviewType)}>
            <Play size={15} fill="white" style={{ stroke: 'none' }} /> Retry Same Type
          </button>
        </div>
      </div>
    );
  }

  return null;
}
