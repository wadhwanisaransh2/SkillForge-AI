import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

export default function AIAssistant() {
  const { 
    currentView, 
    chatHistory, setChatHistory,
    studentProfile,
    gapAnalysis,
    resumeData,
    skillScore,
    pitchMode
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  if (currentView === 'landing' || currentView === 'auth') {
    return null;
  }

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isTyping) return;

    const updatedHistory = [...chatHistory, { sender: 'user', text: messageText }];
    setChatHistory(updatedHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const context = {
        studentName: studentProfile.name,
        targetRole: studentProfile.targetRole,
        skillScore: skillScore,
        currentView: currentView,
        gapAnalysis: gapAnalysis
      };

      const aiReply = await getChatResponse(messageText, context);
      setChatHistory(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      // Graceful fallback response
      const fallback = `💡 **Career Companion Advice:**\n\nAs an aspiring **${studentProfile.targetRole}**, focus on building practical projects and completing your roadmap milestones. Your current score is **${skillScore}%** — you're on the right track! Explore the **AI Skill Gap Analyzer** to see exactly what to learn next.`;
      setChatHistory(prev => [...prev, { sender: 'ai', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, lIdx) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={lIdx} style={{ display: 'block', marginBottom: '4px' }}>
            {parts.map((part, pIdx) => pIdx % 2 === 1
              ? <strong key={pIdx} style={{ color: 'var(--accent)' }}>{part}</strong>
              : part
            )}
          </span>
        );
      }
      return <span key={lIdx} style={{ display: 'block', marginBottom: '2px' }}>{line}</span>;
    });
  };

  return (
    <div className="floating-ai-assistant-widget">


      {/* Expanded Chat Overlay */}
      {isOpen && (
        <div className="ai-assistant-chat-overlay-card glass-panel" style={{ border: '1px solid var(--border-glow-primary)' }}>
          {/* Header */}
          <div className="ai-assistant-header">
            <div className="ai-avatar-dots">
              <Sparkles size={16} />
              <div className="ai-avatar-online-dot"></div>
            </div>
            <div className="ai-assistant-header-text" style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>Career Coach AI</h4>
              <p style={{ margin: 0, fontSize: '10px', color: '#10b981' }}>Powered by Google Gemini</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="ai-assistant-chat-body">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`chat-message-bubble ${msg.sender}`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {renderMessageText(msg.text)}
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-bubble ai" style={{ display: 'flex', gap: '4px', padding: '10px 14px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '6px' }}>Gemini thinking</span>
                <span style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulseParticle 1s infinite' }}></span>
                <span style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulseParticle 1s infinite 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulseParticle 1s infinite 0.4s' }}></span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="ai-chat-quick-actions-box">
            <div className="quick-action-chip" onClick={() => handleSendMessage("What skills am I missing for my target role?")}>
              🔍 Skill Gap Audit
            </div>
            <div className="quick-action-chip" onClick={() => handleSendMessage("Give me resume improvement tips")}>
              📄 Optimize Resume
            </div>
            <div className="quick-action-chip" onClick={() => handleSendMessage("Suggest coding projects for my level")}>
              💻 Recommend Projects
            </div>
            <div className="quick-action-chip" onClick={() => handleSendMessage("How do I validate my startup idea?")}>
              🚀 Startup Feedback
            </div>
          </div>

          {/* Input Footer */}
          <form 
            className="ai-assistant-input-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
          >
            <input 
              type="text"
              placeholder="Ask Gemini anything about your career..."
              className="ai-chat-input-field"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit"
              className="ai-chat-send-btn"
              disabled={isTyping || !inputText.trim()}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Bubble */}
      <div 
        className={`ai-assistant-chat-bubble-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Open SkillForge Gemini AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </div>
    </div>
  );
}
