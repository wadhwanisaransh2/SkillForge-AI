import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';

// Import All Dashboard Views
import LandingPage from './views/LandingPage';
import Auth from './views/Auth';
import StudentDashboard from './views/StudentDashboard';
import GapAnalyzer from './views/GapAnalyzer';
import RoadmapView from './views/RoadmapView';
import ProjectsView from './views/ProjectsView';
import MockInterview from './views/MockInterview';
import ResumeAnalyzer from './views/ResumeAnalyzer';
import ReadinessDashboard from './views/ReadinessDashboard';
import EntrepreneurLaunchpad from './views/EntrepreneurLaunchpad';
import InstitutionDashboard from './views/InstitutionDashboard';
import AdminDashboard from './views/AdminDashboard';
import AssignmentsView from './views/AssignmentsView';

export default function App() {
  const { currentView, mobileSidebarOpen, setMobileSidebarOpen } = useApp();

  // Simple clean client-side routing switch
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <Auth />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'gap-analyzer':
        return <GapAnalyzer />;
      case 'roadmap':
        return <RoadmapView />;
      case 'projects':
        return <ProjectsView />;
      case 'mock-interview':
        return <MockInterview />;
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'readiness':
        return <ReadinessDashboard />;
      case 'entrepreneur':
        return <EntrepreneurLaunchpad />;
      case 'assignments':
        return <AssignmentsView />;
      case 'institution':
      case 'institution-departments':
      case 'institution-trends':
        return <InstitutionDashboard />;
      case 'admin':
      case 'admin-directories':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  const isFullscreenView = currentView === 'landing' || currentView === 'auth';

  return (
    <div className="app-container">
      {/* Top persistent Navbar */}
      <Navbar />

      {/* Main Core Sidebar (Hidden on fullscreen pages) */}
      {!isFullscreenView && <Sidebar />}

      {/* Mobile Sidebar Overlay */}
      {!isFullscreenView && mobileSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Workspace Frame */}
      <main className={`main-content ${isFullscreenView ? 'no-sidebar' : ''}`}>
        {renderActiveView()}
      </main>

      {/* Persistent floating AI chat bubble (Hidden on fullscreen pages) */}
      {!isFullscreenView && <AIAssistant />}
    </div>
  );
}
