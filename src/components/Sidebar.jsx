import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileSearch, 
  GitMerge, 
  FolderGit, 
  MessageSquareCode, 
  FileText, 
  LineChart, 
  Rocket,
  Award,
  Building,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  User,
  ClipboardList
} from 'lucide-react';

export default function Sidebar() {
  const { 
    currentView, 
    setCurrentView, 
    userRole, 
    studentProfile,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useApp();

  if (currentView === 'landing' || currentView === 'auth') {
    return null; // Don't render sidebar on landing or auth pages
  }

  const navigateTo = (viewName) => {
    setCurrentView(viewName);
    setMobileSidebarOpen(false);
  };

  const triggerSimulation = (msg) => {
    alert(msg);
    setMobileSidebarOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "SW";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <aside className={`app-sidebar ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-menu">
        {/* Dynamic Navigation Panels based on active userRole */}
        {userRole === 'student' && (
          <>
            <div style={{ padding: '0 16px 12px 16px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Hub
            </div>
            <div 
              className={`sidebar-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
            
            <div 
              className={`sidebar-item ${currentView === 'gap-analyzer' ? 'active' : ''}`}
              onClick={() => navigateTo('gap-analyzer')}
            >
              <FileSearch size={18} />
              <span>AI Skill Gap</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'roadmap' ? 'active' : ''}`}
              onClick={() => navigateTo('roadmap')}
            >
              <GitMerge size={18} />
              <span>Personal Roadmap</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'assignments' ? 'active' : ''}`}
              onClick={() => navigateTo('assignments')}
            >
              <ClipboardList size={18} />
              <span>Assignments & Tests</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'projects' ? 'active' : ''}`}
              onClick={() => navigateTo('projects')}
            >
              <FolderGit size={18} />
              <span>AI Project Board</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'mock-interview' ? 'active' : ''}`}
              onClick={() => navigateTo('mock-interview')}
            >
              <MessageSquareCode size={18} />
              <span>Mock Interview</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'resume-analyzer' ? 'active' : ''}`}
              onClick={() => navigateTo('resume-analyzer')}
            >
              <FileText size={18} />
              <span>Resume Scanner</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'readiness' ? 'active' : ''}`}
              onClick={() => navigateTo('readiness')}
            >
              <LineChart size={18} />
              <span>Industry Readiness</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'entrepreneur' ? 'active' : ''}`}
              onClick={() => navigateTo('entrepreneur')}
            >
              <Rocket size={18} />
              <span>Startup Launchpad</span>
            </div>
          </>
        )}

        {userRole === 'institution' && (
          <>
            <div style={{ padding: '0 16px 12px 16px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              University Portal
            </div>
            <div 
              className={`sidebar-item ${currentView === 'institution' ? 'active' : ''}`}
              onClick={() => navigateTo('institution')}
            >
              <Building size={18} />
              <span>College Metrics</span>
            </div>
            
            <div 
              className={`sidebar-item ${currentView === 'institution-departments' ? 'active' : ''}`}
              onClick={() => navigateTo('institution-departments')}
            >
              <GraduationCap size={18} />
              <span>Departments</span>
            </div>

            <div 
              className={`sidebar-item ${currentView === 'institution-trends' ? 'active' : ''}`}
              onClick={() => navigateTo('institution-trends')}
            >
              <TrendingUp size={18} />
              <span>Skill Trends</span>
            </div>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <div style={{ padding: '0 16px 12px 16px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Controls
            </div>
            <div 
              className={`sidebar-item ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => navigateTo('admin')}
            >
              <ShieldCheck size={18} />
              <span>Platform Security</span>
            </div>
            
            <div 
              className={`sidebar-item ${currentView === 'admin-directories' ? 'active' : ''}`}
              onClick={() => navigateTo('admin-directories')}
            >
              <User size={18} />
              <span>User Directories</span>
            </div>
          </>
        )}
      </div>

      {/* Mini Profile Footer inside Sidebar */}
      {userRole === 'student' && (
        <div className="sidebar-footer-profile" onClick={() => navigateTo('dashboard')}>
          <div className="avatar-circle-sm">
            {getInitials(studentProfile.name)}
          </div>
          <div className="sidebar-profile-info">
            <h4>{studentProfile.name}</h4>
            <p>{studentProfile.degree.split('in')[0] || studentProfile.degree}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
