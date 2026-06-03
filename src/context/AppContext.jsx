import React, { createContext, useState, useContext, useEffect } from 'react';
import db from '../services/dbService';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Navigation & Role State
  const [currentView, setCurrentView] = useState("landing");
  const [userRole, setUserRole] = useState("student"); // student, institution, admin
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pitchMode, setPitchMode] = useState(true);

  // Student Core Profile States (Hydrated on login, fallback to Saransh Wadhwani defaults)
  const [studentProfile, setStudentProfile] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.profile : {
      name: "Saransh Wadhwani",
      email: "saransh@technonjr.org",
      college: "TECHNO NJR INSTITUTE OF TECHNOLOGY",
      degree: "B.Tech in Computer Science & Engineering",
      year: "4th Year",
      skills: ["Python", "HTML", "CSS", "SQL", "Javascript"],
      targetRole: "Software Engineer",
      careerGoal: "Full-Stack Software Engineer at a Tier-1 tech company or launching a tech startup.",
      phone: "6377145586"
    };
  });

  const [roadmap, setRoadmap] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.roadmap : [];
  });

  const [projects, setProjects] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.projects : [];
  });

  const [badges, setBadges] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.badges : [];
  });

  // Metrics
  const [skillScore, setSkillScore] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.metrics.skillScore : 75;
  });

  const [readinessScore, setReadinessScore] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.metrics.readinessScore : 68;
  });

  const [projectScore, setProjectScore] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.metrics.projectScore : 55;
  });

  const [entrepreneurScore, setEntrepreneurScore] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.metrics.entrepreneurScore : 42;
  });

  const [streakCount, setStreakCount] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.metrics.streakCount : 5;
  });

  // Daily Challenge Pool
  const dailyChallenges = [
    "Implement a function that checks whether a given string is a valid palindrome, ignoring spaces and punctuation.",
    "Write a function that returns the nth Fibonacci number using dynamic programming (memoization).",
    "Given an array of integers, find two numbers that add up to a target sum and return their indices.",
    "Implement a stack using two queues and support push, pop, and peek operations.",
    "Write a function that flattens a deeply nested array into a single-level array without using flat().",
    "Design a function that debounces another function with a specified delay in milliseconds.",
    "Given a binary tree, write a function to return its level-order traversal as an array of arrays.",
    "Implement a basic LRU (Least Recently Used) cache with get and put operations."
  ];
  const todayChallenge = dailyChallenges[new Date().getDay() % dailyChallenges.length];

  // Notifications (Session-only, not saved globally for lightweight storage)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI Skill Gap Analysis updated! 3 missing skills added to focus board.", time: "1 hour ago", unread: true },
    { id: 2, text: "Streak maintained! 5 days active.", time: "5 hours ago", unread: false },
    { id: 3, text: "Completed Beginner Project: 'Responsive Weather Scanner'!", time: "1 day ago", unread: false }
  ]);

  // AI Modules States
  const [gapAnalysis, setGapAnalysis] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.gapAnalysis : {
      analyzed: true,
      existing: ["Python", "HTML", "CSS", "SQL"],
      missing: ["React.js", "Node.js", "Git & GitHub", "Data Structures", "Express.js"],
      roadmapConnection: "Your target role requires Node.js and React.js. We have updated your Roadmap (Weeks 4-6) to include these critical skills.",
      score: 68
    };
  });

  const [resumeData, setResumeData] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.resumeData : {
      scanned: false,
      score: null,
      weaknesses: [],
      keywordsMissing: [],
      atsMatch: ""
    };
  });

  const [interviewResult, setInterviewResult] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.interviewResult : null;
  });

  const [startupIdea, setStartupIdea] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.startupIdea : null;
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const session = db.getActiveSessionUser();
    return session ? session.chatHistory : [
      { sender: "ai", text: "Hello! I am your SkillForge AI Career Companion. Whether you need mock interview coaching, startup validation, custom roadmap deep-dives, or resume optimization tips, I am here to guide you. What can I do for you today?" }
    ];
  });

  // Hydrate states on mounting if session exists
  useEffect(() => {
    const active = db.getActiveSessionUser();
    if (active) {
      setStudentProfile(active.profile);
      setRoadmap(active.roadmap);
      setProjects(active.projects);
      setBadges(active.badges);
      setSkillScore(active.metrics.skillScore);
      setProjectScore(active.metrics.projectScore);
      setEntrepreneurScore(active.metrics.entrepreneurScore);
      setStreakCount(active.metrics.streakCount);
      setGapAnalysis(active.gapAnalysis);
      setResumeData(active.resumeData);
      setInterviewResult(active.interviewResult);
      setStartupIdea(active.startupIdea);
      setChatHistory(active.chatHistory);
      setCurrentView("dashboard");
    } else {
      // Unauthenticated defaults to landing
      setCurrentView("landing");
    }
  }, []);

  // Reactive DB Synchronization
  useEffect(() => {
    if (studentProfile && studentProfile.email) {
      db.saveUserState(studentProfile.email, {
        profile: studentProfile,
        roadmap,
        projects,
        badges,
        metrics: {
          skillScore,
          readinessScore,
          projectScore,
          entrepreneurScore,
          streakCount
        },
        gapAnalysis,
        resumeData,
        interviewResult,
        startupIdea,
        chatHistory
      });
    }
  }, [
    studentProfile, roadmap, projects, badges,
    skillScore, readinessScore, projectScore, entrepreneurScore,
    streakCount, gapAnalysis, resumeData, interviewResult, startupIdea, chatHistory
  ]);

  // Auth Action Handlers
  const loginUser = (email, password) => {
    const user = db.authenticate(email, password);
    setStudentProfile(user.profile);
    setRoadmap(user.roadmap);
    setProjects(user.projects);
    setBadges(user.badges);
    setSkillScore(user.metrics.skillScore);
    setProjectScore(user.metrics.projectScore);
    setEntrepreneurScore(user.metrics.entrepreneurScore);
    setStreakCount(user.metrics.streakCount);
    setGapAnalysis(user.gapAnalysis);
    setResumeData(user.resumeData);
    setInterviewResult(user.interviewResult);
    setStartupIdea(user.startupIdea);
    setChatHistory(user.chatHistory);

    setUserRole("student");
    setCurrentView("dashboard");
    addNotification(`🎉 Welcome back, ${user.profile.name}!`);
  };

  const registerUser = (profile, password) => {
    const user = db.register(profile, password);
    setStudentProfile(user.profile);
    setRoadmap(user.roadmap);
    setProjects(user.projects);
    setBadges(user.badges);
    setSkillScore(user.metrics.skillScore);
    setProjectScore(user.metrics.projectScore);
    setEntrepreneurScore(user.metrics.entrepreneurScore);
    setStreakCount(user.metrics.streakCount);
    setGapAnalysis(user.gapAnalysis);
    setResumeData(user.resumeData);
    setInterviewResult(user.interviewResult);
    setStartupIdea(user.startupIdea);
    setChatHistory(user.chatHistory);

    setUserRole("student");
    setCurrentView("dashboard");
    addNotification(`🎉 Account successfully created! Welcome, ${user.profile.name}.`);
  };

  const logoutUser = () => {
    db.logout();
    setStudentProfile({
      name: "Saransh Wadhwani",
      email: "saransh@technonjr.org",
      college: "TECHNO NJR INSTITUTE OF TECHNOLOGY",
      degree: "B.Tech in Computer Science & Engineering",
      year: "4th Year",
      skills: ["Python", "HTML", "CSS", "SQL", "Javascript"],
      targetRole: "Software Engineer",
      careerGoal: "Full-Stack Software Engineer at a Tier-1 tech company or launching a tech startup.",
      phone: "6377145586"
    });
    // Set default roadmap/projects for landing views
    setRoadmap([]);
    setProjects([]);
    setBadges([]);
    setSkillScore(75);
    setProjectScore(55);
    setEntrepreneurScore(42);
    setStreakCount(5);
    setGapAnalysis({
      analyzed: true,
      existing: ["Python", "HTML", "CSS", "SQL"],
      missing: ["React.js", "Node.js", "Git & GitHub", "Data Structures", "Express.js"],
      roadmapConnection: "Your target role requires Node.js and React.js. We have updated your Roadmap (Weeks 4-6) to include these critical skills.",
      score: 68
    });
    setResumeData({
      scanned: false,
      score: null,
      weaknesses: [],
      keywordsMissing: [],
      atsMatch: ""
    });
    setInterviewResult(null);
    setStartupIdea(null);
    setChatHistory([
      { sender: "ai", text: "Hello! I am your SkillForge AI Career Companion. Whether you need mock interview coaching, startup validation, custom roadmap deep-dives, or resume optimization tips, I am here to guide you. What can I do for you today?" }
    ]);

    setUserRole("student");
    setCurrentView("landing");
  };

  // Add Notification
  const addNotification = (text) => {
    setNotifications(prev => [
      { id: Date.now(), text, time: "Just now", unread: true },
      ...prev
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Toggle checklist tasks in the timeline roadmap
  const toggleTask = (weekIndex, taskId) => {
    setRoadmap(prevRoadmap => {
      const updated = prevRoadmap.map((w, idx) => {
        if (idx === weekIndex) {
          const updatedTasks = w.tasks.map(t => {
            if (t.id === taskId) {
              const newStatus = !t.completed;
              if (newStatus) {
                addNotification(`Completed Roadmap Task: "${t.text}"`);
              }
              return { ...t, completed: newStatus };
            }
            return t;
          });

          const allDone = updatedTasks.every(t => t.completed);

          return {
            ...w,
            tasks: updatedTasks,
            completed: allDone
          };
        }
        return w;
      });

      // Calculate new project & readiness score based on roadmap completions
      const totalTasks = updated.reduce((acc, w) => acc + w.tasks.length, 0);
      if (totalTasks > 0) {
        const completedTasks = updated.reduce((acc, w) => acc + w.tasks.filter(t => t.completed).length, 0);
        const roadmapPercent = Math.round((completedTasks / totalTasks) * 100);
        setProjectScore(Math.min(95, Math.max(30, Math.round(55 + (roadmapPercent - 30) * 0.5))));
      }

      // Auto-unlock next week if current is finished
      const completedIndex = weekIndex;
      if (updated[completedIndex].completed && completedIndex + 1 < updated.length) {
        if (updated[completedIndex + 1].locked) {
          updated[completedIndex + 1].locked = false;
          addNotification(`🎉 Week ${updated[completedIndex + 1].week} has been unlocked!`);

          if (updated[completedIndex].week === 2) {
            unlockBadge("Timeline Master");
          }
        }
      }

      return updated;
    });
  };

  // Unlock badges
  const unlockBadge = (badgeTitle) => {
    setBadges(prev => prev.map(b => {
      if (b.title === badgeTitle && !b.unlocked) {
        addNotification(`🏆 Badge Unlocked: ${badgeTitle}!`);
        return { ...b, unlocked: true };
      }
      return b;
    }));
  };

  // Toggle project completion
  const completeProjectInContext = (projectId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && !p.completed) {
        addNotification(`💻 Completed Project: "${p.title}"!`);
        setProjectScore(prevScore => Math.min(100, prevScore + 10));
        unlockBadge("Code Warrior");
        return { ...p, completed: true };
      }
      return p;
    }));
  };

  // Auto-calculate dynamic Industry Readiness Score
  useEffect(() => {
    const calculatedScore = Math.round(
      (skillScore * 0.35) +
      (projectScore * 0.25) +
      ((interviewResult ? interviewResult.score : 50) * 0.25) +
      (entrepreneurScore * 0.15)
    );
    setReadinessScore(calculatedScore);
  }, [skillScore, projectScore, interviewResult, entrepreneurScore]);

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      userRole, setUserRole,
      mobileSidebarOpen, setMobileSidebarOpen,
      pitchMode, setPitchMode,
      dailyChallenge: todayChallenge,
      studentProfile, setStudentProfile,
      roadmap, setRoadmap,
      projects, setProjects,
      badges, setBadges,
      skillScore, setSkillScore,
      readinessScore, setReadinessScore,
      projectScore, setProjectScore,
      entrepreneurScore, setEntrepreneurScore,
      streakCount, setStreakCount,
      notifications, setNotifications,
      addNotification,
      markAllNotificationsRead,
      toggleTask,
      unlockBadge,
      completeProjectInContext,
      gapAnalysis, setGapAnalysis,
      resumeData, setResumeData,
      interviewResult, setInterviewResult,
      startupIdea, setStartupIdea,
      chatHistory, setChatHistory,
      loginUser, registerUser, logoutUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
