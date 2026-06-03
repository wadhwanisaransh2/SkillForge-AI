// src/services/dbService.js
// High-fidelity persistent database wrapper using localStorage for hackathon demo deployment

const USERS_KEY = 'skillforge_database_users';
const SESSION_KEY = 'skillforge_active_user_email';

// Initial preloaded roadmap data
const defaultRoadmap = [
  {
    week: 1,
    title: "Python Fundamentals & Version Control",
    description: "Master clean coding conventions in Python and learn the fundamentals of Git.",
    topics: ["Variables, loops, functions", "Object-Oriented Programming (OOP)", "Git branching and GitHub workflows"],
    tasks: [
      { id: "w1-t1", text: "Complete Python OOP syntax assignment", completed: true },
      { id: "w1-t2", text: "Create a GitHub repository and push a branch", completed: true },
      { id: "w1-t3", text: "Solve 5 Python practice challenges on loops/lists", completed: true }
    ],
    completed: true,
    locked: false
  },
  {
    week: 2,
    title: "Data Structures & Core Algorithms",
    description: "Delve into standard memory management models, complexity analysis, and algorithms.",
    topics: ["Big-O complexity", "Arrays, Linked Lists, Stacks, Queues", "Sorting and Searching algorithms"],
    tasks: [
      { id: "w2-t1", text: "Implement a Singly Linked List in Python", completed: true },
      { id: "w2-t2", text: "Analyze the time complexity of bubble vs quicksort", completed: false },
      { id: "w2-t3", text: "Complete daily search-algorithm challenge", completed: false }
    ],
    completed: false,
    locked: false
  },
  {
    week: 3,
    title: "Database Design & SQL Mastery",
    description: "Learn how to store, query, and optimize transactional databases.",
    topics: ["Relational schemas & Normalization", "SELECT queries, JOINs, Group By", "Indexes & query optimization"],
    tasks: [
      { id: "w3-t1", text: "Create a relational schema for an e-commerce database", completed: false },
      { id: "w3-t2", text: "Write standard complex JOIN queries for sales reports", completed: false }
    ],
    completed: false,
    locked: true
  },
  {
    week: 4,
    title: "Modern Backend Web Services",
    description: "Build robust REST APIs using Node.js, Express, and structured JSON communications.",
    topics: ["Node.js event loop & NPM", "Express router & Middlewares", "API routing & error handling"],
    tasks: [
      { id: "w4-t1", text: "Initialize an Express app with standard endpoints", completed: false },
      { id: "w4-t2", text: "Write custom validation middleware for POST requests", completed: false }
    ],
    completed: false,
    locked: true
  },
  {
    week: 5,
    title: "Frontend UI & State Management",
    description: "Learn the fundamentals of responsive design, React components, and active rendering.",
    topics: ["React JSX & props/state", "React hooks (useState, useEffect)", "CSS Flexbox/Grid responsive panels"],
    tasks: [
      { id: "w5-t1", text: "Create a dynamic profile card component in React", completed: false },
      { id: "w5-t2", text: "Integrate a public weather API using fetch/axios", completed: false }
    ],
    completed: false,
    locked: true
  },
  {
    week: 6,
    title: "Full-Stack Integration & Security",
    description: "Connect your frontend and backend, configure database persistence, and secure routes.",
    topics: ["CORS, environment variables", "Authentication using JWT", "Database integration (MongoDB/PostgreSQL)"],
    tasks: [
      { id: "w6-t1", text: "Implement login credentials hashing using bcrypt", completed: false },
      { id: "w6-t2", text: "Establish a JWT middleware router block", completed: false }
    ],
    completed: false,
    locked: true
  },
  {
    week: 7,
    title: "Mock Interview & Technical QA Review",
    description: "Simulate rigorous interview loops and optimize behavioral templates.",
    topics: ["Coding whiteboard problems", "STAR methodology for behavioral metrics", "System design layouts"],
    tasks: [
      { id: "w7-t1", text: "Draft answers for 5 standard behavioral questions", completed: false },
      { id: "w7-t2", text: "Review system architecture database patterns", completed: false }
    ],
    completed: false,
    locked: true
  },
  {
    week: 8,
    title: "Capstone Project Launch & Deployment",
    description: "Finalize a production-ready web application and deploy it live.",
    topics: ["Render/Vercel server hosting", "CI/CD automated tests", "Pitching your project to recruiters"],
    tasks: [
      { id: "w8-t1", text: "Set up env variables on deployment server", completed: false },
      { id: "w8-t2", text: "Submit final capstone dashboard link", completed: false }
    ],
    completed: false,
    locked: true
  }
];

// Initial projects data
const defaultProjects = [
  {
    id: "p1",
    title: "Modern To-Do Workspace",
    difficulty: "Beginner",
    description: "Create a task tracking application featuring local storage persistence, category tags, and clean filter options.",
    tech: ["HTML5", "CSS Grid", "Vanilla Javascript"],
    time: "4 Hours",
    completed: true
  },
  {
    id: "p2",
    title: "Responsive Weather Scanner",
    difficulty: "Beginner",
    description: "Design an attractive weather dashboard fetching data from OpenWeather API, displaying dynamic weather icons based on weather codes.",
    tech: ["HTML5", "CSS Glassmorphism", "Javascript API Fetch"],
    time: "6 Hours",
    completed: true
  },
  {
    id: "p3",
    title: "Interactive Expense Tracker",
    difficulty: "Intermediate",
    description: "Build an active ledger to monitor budgets. Displays visual spend analysis with dynamic percentage meters.",
    tech: ["React.js", "Vanilla CSS Modules", "Local Storage API"],
    time: "12 Hours",
    completed: false
  },
  {
    id: "p4",
    title: "Real-time Slack-lite Application",
    difficulty: "Intermediate",
    description: "Launch an instant messaging application using web sockets. Features individual chatrooms and message history databases.",
    tech: ["Node.js", "Express", "Socket.io", "MongoDB"],
    time: "24 Hours",
    completed: false
  },
  {
    id: "p5",
    title: "Resume Keyword Scan AI Analyzer",
    difficulty: "Advanced",
    description: "Develop a high-fidelity utility parsing PDF/text content to measure ATS search term compatibility, rendering a visual rating score.",
    tech: ["React.js", "NLP parser library", "Vanilla CSS animations"],
    time: "35 Hours",
    completed: false
  },
  {
    id: "p6",
    title: "AI Interactive Interview Assistant",
    difficulty: "Advanced",
    description: "Build an interactive audio/text chat workspace simulating HR board loops, returning full scores and structured improvement pointers.",
    tech: ["React.js", "Web Speech API", "Gemini API integrations"],
    time: "40 Hours",
    completed: false
  }
];

// Initial badges data
const defaultBadges = [
  { id: "b1", title: "Gap Solver", desc: "Completed the AI Skill Gap analysis.", unlocked: true, icon: "Award" },
  { id: "b2", title: "Timeline Master", desc: "Finished the first week of your roadmap.", unlocked: true, icon: "Calendar" },
  { id: "b3", title: "Resume Architect", desc: "Scanned and optimized your resume.", unlocked: false, icon: "FileText" },
  { id: "b4", title: "Code Warrior", desc: "Completed 2 beginner projects.", unlocked: true, icon: "Cpu" },
  { id: "b5", title: "Mock Veteran", desc: "Finished your first mock interview with 75%+", unlocked: false, icon: "Zap" },
  { id: "b6", title: "Founding Titan", desc: "Generated a complete Business Model Canvas.", unlocked: false, icon: "Rocket" }
];

// Default demo user structure (Saransh Wadhwani)
const demoUserEmail = "saransh@technonjr.org";
const demoUserPassword = "demo1234";

const initialDemoState = {
  email: demoUserEmail,
  password: demoUserPassword,
  profile: {
    name: "Saransh Wadhwani",
    email: demoUserEmail,
    college: "TECHNO NJR INSTITUTE OF TECHNOLOGY",
    degree: "B.Tech in Computer Science & Engineering",
    year: "4th Year",
    skills: ["Python", "HTML", "CSS", "SQL", "Javascript"],
    targetRole: "Software Engineer",
    careerGoal: "Full-Stack Software Engineer at a Tier-1 tech company or launching a tech startup.",
    phone: "6377145586"
  },
  roadmap: defaultRoadmap,
  projects: defaultProjects,
  badges: defaultBadges,
  metrics: {
    skillScore: 75,
    readinessScore: 68,
    projectScore: 55,
    entrepreneurScore: 42,
    streakCount: 5
  },
  gapAnalysis: {
    analyzed: true,
    existing: ["Python", "HTML", "CSS", "SQL"],
    missing: ["React.js", "Node.js", "Git & GitHub", "Data Structures", "Express.js"],
    roadmapConnection: "Your target role requires Node.js and React.js. We have updated your Roadmap (Weeks 4-6) to include these critical skills.",
    score: 68
  },
  resumeData: {
    scanned: false,
    score: null,
    weaknesses: [],
    keywordsMissing: [],
    atsMatch: ""
  },
  interviewResult: null,
  startupIdea: null,
  chatHistory: [
    { sender: "ai", text: "Hello! I am your SkillForge AI Career Companion. Whether you need mock interview coaching, startup validation, custom roadmap deep-dives, or resume optimization tips, I am here to guide you. What can I do for you today?" }
  ]
};

// Database utility helpers
const db = {
  getAllUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  saveAllUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  initDatabase() {
    const users = this.getAllUsers();
    let changed = false;
    // Remove old Alex registry entries if they exist
    if (users["alex.rivera@university.edu"]) {
      delete users["alex.rivera@university.edu"];
      changed = true;
    }
    if (users["alex@university.edu"]) {
      delete users["alex@university.edu"];
      changed = true;
    }
    // Pre-register demo user if not already in store
    // Also overwrite demo user if name is still old, to ensure Saransh is saved
    if (!users[demoUserEmail] || users[demoUserEmail].profile.name !== "Saransh Wadhwani") {
      users[demoUserEmail] = initialDemoState;
      changed = true;
    }
    if (changed) {
      this.saveAllUsers(users);
    }
  },

  authenticate(email, password) {
    this.initDatabase();
    const users = this.getAllUsers();
    const user = users[email.toLowerCase().trim()];
    
    if (!user) {
      throw new Error("Invalid credentials: User profile does not exist.");
    }
    
    if (user.password !== password) {
      throw new Error("Invalid credentials: Hashed check match failure.");
    }

    localStorage.setItem(SESSION_KEY, user.email);
    return user;
  },

  register(profile, password) {
    this.initDatabase();
    const users = this.getAllUsers();
    const emailKey = profile.email.toLowerCase().trim();

    if (users[emailKey]) {
      throw new Error("An account is already registered with this email address.");
    }

    const newUser = {
      email: emailKey,
      password: password || 'demo1234',
      profile: {
        name: profile.name,
        email: profile.email,
        college: profile.college,
        degree: profile.degree,
        year: profile.year,
        skills: profile.skills || ['Python', 'SQL'],
        targetRole: profile.targetRole,
        careerGoal: profile.careerGoal || `Build skills to excel as a ${profile.targetRole}.`
      },
      roadmap: defaultRoadmap.map(w => ({
        ...w,
        tasks: w.tasks.map(t => ({ ...t, completed: false })),
        completed: false,
        locked: w.week > 2
      })),
      projects: defaultProjects.map(p => ({ ...p, completed: false })),
      badges: defaultBadges.map(b => ({ ...b, unlocked: b.id === 'b1' })),
      metrics: {
        skillScore: 40,
        readinessScore: 35,
        projectScore: 20,
        entrepreneurScore: 20,
        streakCount: 1
      },
      gapAnalysis: {
        analyzed: false,
        existing: [],
        missing: [],
        roadmapConnection: "",
        score: 0
      },
      resumeData: {
        scanned: false,
        score: null,
        weaknesses: [],
        keywordsMissing: [],
        atsMatch: ""
      },
      interviewResult: null,
      startupIdea: null,
      chatHistory: [
        { sender: "ai", text: `Welcome, ${profile.name}! I am your SkillForge AI Career Companion. How can I help you prepare for a career as a ${profile.targetRole}?` }
      ]
    };

    users[emailKey] = newUser;
    this.saveAllUsers(users);
    
    localStorage.setItem(SESSION_KEY, newUser.email);
    return newUser;
  },

  saveUserState(email, data) {
    const users = this.getAllUsers();
    const key = email.toLowerCase().trim();
    if (users[key]) {
      users[key] = {
        ...users[key],
        ...data
      };
      this.saveAllUsers(users);
    }
  },

  getActiveSessionUser() {
    this.initDatabase();
    const activeEmail = localStorage.getItem(SESSION_KEY);
    if (!activeEmail) return null;
    
    // Auto-logout and clear old Alex session if cached
    const normalizedEmail = activeEmail.toLowerCase().trim();
    if (normalizedEmail === "alex.rivera@university.edu" || normalizedEmail === "alex@university.edu") {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    
    const users = this.getAllUsers();
    const user = users[normalizedEmail] || null;
    if (user && (user.profile.name === "Alex Rivera" || user.profile.email.includes("alex"))) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getDemoCredentials() {
    return {
      email: demoUserEmail,
      password: demoUserPassword
    };
  }
};

export default db;
