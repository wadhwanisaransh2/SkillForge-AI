import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList, Check, Lock, Clock, Trophy, ChevronRight,
  Sparkles, AlertCircle, Filter, BarChart3, BookOpen, Code2,
  FileText, Target, Zap, CheckCircle2, Circle, Star, ArrowRight,
  GitMerge, Play, X, AlertTriangle, Flame, ExternalLink, Terminal, ShieldAlert
} from 'lucide-react';

// ─── ASSIGNMENT TYPE CONFIG ────────────────────────────────────────────────
const TASK_TYPE_CONFIG = {
  code: { icon: Code2, color: '#6366f1', label: 'Coding Task', badge: 'badge-glow' },
  read: { icon: BookOpen, color: '#0891b2', label: 'Study Task', badge: 'badge-cyan' },
  build: { icon: GitMerge, color: '#a855f7', label: 'Build Project', badge: 'badge-glow' },
  practice: { icon: Zap, color: '#d97706', label: 'Practice Task', badge: 'badge-warning' },
  apply: { icon: Target, color: '#059669', label: 'Apply Task', badge: 'badge-success' },
};

// Guess task type from text keywords
function guessTaskType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('code') || lower.includes('implement') || lower.includes('write') || lower.includes('solve') || lower.includes('function') || lower.includes('algorithm')) return 'code';
  if (lower.includes('build') || lower.includes('project') || lower.includes('create') || lower.includes('deploy') || lower.includes('develop')) return 'build';
  if (lower.includes('read') || lower.includes('study') || lower.includes('learn') || lower.includes('research') || lower.includes('documentation') || lower.includes('tutorial') || lower.includes('course') || lower.includes('watch')) return 'read';
  if (lower.includes('practice') || lower.includes('leetcode') || lower.includes('exercise') || lower.includes('quiz') || lower.includes('challenge')) return 'practice';
  if (lower.includes('apply') || lower.includes('submit') || lower.includes('push') || lower.includes('github') || lower.includes('linkedin') || lower.includes('post') || lower.includes('share')) return 'apply';
  return 'read';
}

// Estimate effort in minutes from task text
function estimateEffort(text) {
  const lower = text.toLowerCase();
  if (lower.includes('project') || lower.includes('build') || lower.includes('deploy')) return '2-3 hrs';
  if (lower.includes('leetcode') || lower.includes('solve') || lower.includes('algorithm')) return '45-60 min';
  if (lower.includes('course') || lower.includes('tutorial') || lower.includes('playlist')) return '1-2 hrs';
  if (lower.includes('read') || lower.includes('article') || lower.includes('documentation')) return '30-45 min';
  return '30-60 min';
}

// ─── QUIZ DATA POOL ────────────────────────────────────────────────────────
const WEEK_QUIZZES = {
  1: [
    {
      q: "Which keyword is used to define a class in Python?",
      o: ["def", "class", "init", "object"],
      a: 1,
      explanation: "In Python, classes are declared using the 'class' keyword."
    },
    {
      q: "What is the purpose of the '__init__' method in a Python class?",
      o: ["To import standard packages", "To initialize class instance attributes", "To define static compiler parameters", "To terminate a class lifecycle"],
      a: 1,
      explanation: "'__init__' is the constructor method in Python classes, called when an object is instantiated to initialize its state attributes."
    },
    {
      q: "Which Git command is used to record staged changes to the repository history?",
      o: ["git add", "git push", "git commit", "git stash"],
      a: 2,
      explanation: "'git commit' records staged modifications into the project history. 'git add' only stages them for committing."
    }
  ],
  2: [
    {
      q: "What is the time complexity to access an element in an array by its index?",
      o: ["O(1) - Constant time", "O(N) - Linear time", "O(log N) - Logarithmic time", "O(N^2) - Quadratic time"],
      a: 0,
      explanation: "Arrays allow constant time O(1) index lookups due to contiguous memory allocation."
    },
    {
      q: "In a Singly Linked List, how is the next node referenced?",
      o: ["Using an integer index lookup", "Using a memory address pointer in the current node", "Through a global linked dictionary", "Linked lists do not reference next nodes"],
      a: 1,
      explanation: "Each node in a singly linked list contains data and a pointer/reference to the next node in sequence."
    },
    {
      q: "Which sorting algorithm has a worst-case time complexity of O(N^2) but an average complexity of O(N log N)?",
      o: ["Merge Sort", "Quick Sort", "Bubble Sort", "Insertion Sort"],
      a: 1,
      explanation: "Quicksort averages O(N log N) but degrades to O(N^2) if pivot choices are highly unbalanced."
    }
  ],
  3: [
    {
      q: "Which of the following joins returns all rows from the left table, and matching rows from the right table?",
      o: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL OUTER JOIN"],
      a: 2,
      explanation: "A LEFT JOIN returns all records from the left table and matched records from the right table. Unmatched right rows return NULL."
    },
    {
      q: "What is database normalization mainly used for?",
      o: ["Encrypting database credentials", "Minimizing data redundancy and dependency issues", "Increasing query response times without cache", "Converting SQL tables to JSON arrays"],
      a: 1,
      explanation: "Normalization organizes tables to reduce duplicate data and ensure relational dependencies make logical sense."
    },
    {
      q: "What is a Foreign Key in database design?",
      o: ["A column that encrypts table schema values", "A key used to connect two tables by referencing a primary key in another table", "A primary index that holds custom string values", "An external SQL server access credentials token"],
      a: 1,
      explanation: "A Foreign Key is a field in one table that links to the Primary Key of another table, enforcing referential integrity."
    }
  ],
  4: [
    {
      q: "What is Express.js in the Node ecosystem?",
      o: ["A database ORM tool for SQL schemas", "A minimalist web application routing and middleware framework", "A unit testing library", "A compiler package for typescript"],
      a: 1,
      explanation: "Express is a minimal and flexible Node.js web application framework providing features for web and mobile applications."
    },
    {
      q: "What are Node.js Express middlewares?",
      o: ["Databases storing server state", "Functions that have access to request, response objects and the next middleware", "HTML rendering templates", "API endpoint variables"],
      a: 1,
      explanation: "Middleware functions execute code, modify request/response objects, and pass control using the 'next()' function."
    },
    {
      q: "Which response status code represents a successful creation of a database record?",
      o: ["200 OK", "201 Created", "304 Not Modified", "400 Bad Request"],
      a: 1,
      explanation: "201 Created indicates the request succeeded and a new resource was successfully created."
    }
  ],
  5: [
    {
      q: "What are the two types of data that control a React component?",
      o: ["Variables & Constants", "Props & State", "Inputs & Outputs", "JSON & XML"],
      a: 1,
      explanation: "Props are read-only configuration parameters passed down, while State is internal mutable data managed by the component."
    },
    {
      q: "When does the callback inside 'useEffect' with an empty dependency array `[]` run?",
      o: ["Every time the component state updates", "Only once when the component mounts", "Right before the component updates props", "Never during component rendering lifecycle"],
      a: 1,
      explanation: "An empty dependency array tells React to run the hook effect only once after the component initially mounts."
    },
    {
      q: "What is CSS Grid Layout used for?",
      o: ["Encrypting flex containers", "Handling 2-dimensional layouts (rows and columns simultaneously)", "Adding linear gradients to hover cards", "Structuring database tables"],
      a: 1,
      explanation: "CSS Grid is a 2D layout model designed to align elements along columns and rows."
    }
  ],
  6: [
    {
      q: "What does JWT stand for in web security?",
      o: ["Java Web Transition", "JSON Web Token", "Jumbled Web Text", "Joint Web Transfer"],
      a: 1,
      explanation: "JWT stands for JSON Web Token, which securely transmits compact JSON payloads between client and server."
    },
    {
      q: "Where is a JWT typically sent in HTTP requests for authentication?",
      o: ["In the query parameters", "In the Authorization header as a Bearer token", "Inside the request payload boundary", "Inside the User-Agent cookie block"],
      a: 1,
      explanation: "JWTs are standardly passed in the HTTP Authorization header using the scheme: `Bearer <token>`."
    },
    {
      q: "What is bcrypt used for in web backend applications?",
      o: ["Validating email formats", "Hashing and salting user passwords securely", "Encoding image URLs into base64", "Decrypting database credentials"],
      a: 1,
      explanation: "Bcrypt is a blowfish-based password-hashing algorithm designed to resist brute-force attacks by adding custom salts."
    }
  ],
  7: [
    {
      q: "What does the STAR methodology represent in behavioral interviews?",
      o: ["Syntax, Testing, Algorithms, Review", "Situation, Task, Action, Result", "Standards, Tactics, Analytics, Reporting", "Skill, Target, Analysis, Roadmap"],
      a: 1,
      explanation: "STAR stands for Situation, Task, Action, and Result — a structured manner of answering behavioral questions."
    },
    {
      q: "What is the primary goal of System Design interviews?",
      o: ["Writing optimal binary search trees", "Designing scalable, reliable, and efficient system architectures", "Formatting CSS card widgets for dashboards", "Writing schema migration SQL updates"],
      a: 1,
      explanation: "System design validates your ability to assemble microservices, databases, load balancers, and caches to solve large-scale problems."
    },
    {
      q: "Which database system is best suited for scaling writes across unstructured log records?",
      o: ["Relational Database (PostgreSQL)", "NoSQL Document Database (MongoDB/Cassandra)", "In-memory key-value cache (Redis)", "Graph Database (Neo4j)"],
      a: 1,
      explanation: "NoSQL document or column stores scale write throughput horizontally and easily accommodate dynamic/unstructured log fields."
    }
  ],
  8: [
    {
      q: "What is a CI/CD pipeline?",
      o: ["Central Interface for Coding Databases", "Continuous Integration & Continuous Deployment", "Critical Items and Client Directories", "Common Internet Code Delivery"],
      a: 1,
      explanation: "CI/CD automates the build, test, and deployment phases to deliver software updates reliably and frequently."
    },
    {
      q: "Why are Environment Variables used in production deployment setups?",
      o: ["To speed up frontend asset load times", "To keep sensitive configurations (API keys, database URLs) out of source control", "To set the grid sizes of responsive panels", "To debug javascript DOM compiler errors"],
      a: 1,
      explanation: "Environment variables keep secret keys out of GitHub source code repositories, preventing security exposures."
    },
    {
      q: "Which response status code represents a resource redirect or permanent routing change?",
      o: ["200 OK", "301 Moved Permanently", "404 Not Found", "500 Internal Server Error"],
      a: 1,
      explanation: "301 Moved Permanently is standard for redirection of URLs."
    }
  ]
};

// ─── CODING CHALLENGE POOL ──────────────────────────────────────────────────
const CODING_CHALLENGES = {
  "w1-t1": {
    title: "Python OOP Syntax Assignment",
    description: "Write a class 'Car' that inherits from a class 'Vehicle'. 'Vehicle' has an '__init__' constructor setting the attribute 'brand'. 'Car' should call the parent constructor and also set 'model'. Add a method 'get_details()' returning a string in the format: 'Brand: [brand], Model: [model]'.",
    template: `# Write your Python OOP code below\nclass Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\n# Extend Vehicle to define class Car\nclass Car(Vehicle):\n    def __init__(self, brand, model):\n        # Your code here\n        pass\n        \n    def get_details(self):\n        # Your code here\n        return ""\n`,
    tests: [
      "Running compiler syntax check... PASSED",
      "test_inheritance: Car inherits from Vehicle... PASSED",
      "test_constructor: setting brand and model... PASSED",
      "test_get_details_format: matches 'Brand: Tesla, Model: S'... PASSED",
      "All 4 validation test cases successfully passed!"
    ]
  },
  "w1-t3": {
    title: "Solve 5 Python practice challenges on loops/lists",
    description: "Write a function 'find_pairs(numbers, target)' that finds all pairs of integers in the list 'numbers' that sum up to 'target'. Return a list of sorted tuples representing these pairs. For example, find_pairs([1, 2, 3, 4], 5) should return [(1, 4), (2, 3)].",
    template: `def find_pairs(numbers, target):\n    # Write your loop/list logic here\n    # Return a list of sorted pairs that sum to target\n    return []\n`,
    tests: [
      "Verifying function signature find_pairs... PASSED",
      "test_simple_sum: find_pairs([1, 2, 3, 4], 5) => [(1, 4), (2, 3)]... PASSED",
      "test_no_matches: find_pairs([1, 2, 3], 10) => []... PASSED",
      "test_duplicates: find_pairs([2, 2, 3], 4) => [(2, 2)]... PASSED",
      "All test cases passed! Performance is O(N) linear time complexity."
    ]
  },
  "w2-t1": {
    title: "Singly Linked List Implementation",
    description: "Implement a class 'Node' and a class 'LinkedList'. Add an 'insert_at_tail(data)' method to append a node with value 'data' to the end of the list. Add a 'to_list()' method returning a normal Python list of the node values.",
    template: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n        \n    def insert_at_tail(self, data):\n        # Insert node at tail\n        pass\n        \n    def to_list(self):\n        # Return python list of node values\n        return []\n`,
    tests: [
      "Validating class Node constructor... PASSED",
      "Validating class LinkedList constructor... PASSED",
      "test_single_insert: LinkedList.insert_at_tail(5) => [5]... PASSED",
      "test_multiple_inserts: LinkedList [10, 20, 30] => [10, 20, 30]... PASSED",
      "All LinkedList verification cases passed!"
    ]
  }
};

const getCodingChallenge = (task) => {
  if (CODING_CHALLENGES[task.id]) {
    return CODING_CHALLENGES[task.id];
  }
  // Dynamic fallback based on task text
  const lower = task.text.toLowerCase();
  let desc = `Solve the following coding task: "${task.text}". Write a python function/module implementing the required logic. Ensure correctness, write cleaner functions, and avoid side effects.`;
  let temp = `def solve_assignment():\n    # Write your solution code here\n    # Return the finalized output\n    return True\n`;
  let tests = [
    "Analyzing compiler tree structures... PASSED",
    "Running code coverage simulation... PASSED",
    "test_functional_correctness: output matches requirements... PASSED",
    "test_boundary_conditions: edge-cases handled... PASSED",
    "All automated code validation tests passed!"
  ];

  if (lower.includes('loop') || lower.includes('list') || lower.includes('array')) {
    desc = "Write a function 'find_pairs(numbers, target)' that finds all pairs of integers in the list 'numbers' that sum up to 'target'. Return a list of sorted tuples representing these pairs. For example, find_pairs([1, 2, 3, 4], 5) should return [(1, 4), (2, 3)].";
    temp = `def find_pairs(numbers, target):\n    # Write your loop/list logic here\n    pairs = []\n    seen = set()\n    for num in numbers:\n        comp = target - num\n        if comp in seen:\n            pairs.append((min(num, comp), max(num, comp)))\n        seen.add(num)\n    return sorted(pairs)\n`;
    tests = [
      "Verifying function signature find_pairs... PASSED",
      "test_simple_sum: find_pairs([1, 2, 3, 4], 5) => [(1, 4), (2, 3)]... PASSED",
      "test_no_matches: find_pairs([1, 2, 3], 10) => []... PASSED",
      "All test cases passed!"
    ];
  } else if (lower.includes('oop') || lower.includes('class') || lower.includes('syntax')) {
    desc = "Write a class 'Car' that inherits from a class 'Vehicle'. 'Vehicle' has an '__init__' constructor setting the attribute 'brand'. 'Car' should call the parent constructor and also set 'model'. Add a method 'get_details()' returning a string in the format: 'Brand: [brand], Model: [model]'.";
    temp = `class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\n# Extend Vehicle to define class Car\nclass Car(Vehicle):\n    def __init__(self, brand, model):\n        # Call parent constructor and set model\n        super().__init__(brand)\n        self.model = model\n        \n    def get_details(self):\n        return f"Brand: {self.brand}, Model: {self.model}"\n`;
    tests = [
      "Running compiler syntax check... PASSED",
      "test_inheritance: Car inherits from Vehicle... PASSED",
      "test_constructor: setting brand and model... PASSED",
      "All validation test cases successfully passed!"
    ];
  } else if (lower.includes('linked list') || lower.includes('node') || lower.includes('tree') || lower.includes('stack')) {
    desc = "Implement a class 'Node' and a class 'LinkedList'. Add an 'insert_at_tail(data)' method to append a node with value 'data' to the end of the list. Add a 'to_list()' method returning a normal Python list of the node values.";
    temp = `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n        \n    def insert_at_tail(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new_node\n`;
    tests = [
      "Validating node constructors... PASSED",
      "test_multiple_inserts: LinkedList [10, 20, 30] => [10, 20, 30]... PASSED",
      "All LinkedList verification cases passed!"
    ];
  }

  return { title: task.text, description: desc, template: temp, tests };
};

// ─── MINI TASK CARD ────────────────────────────────────────────────────────
function AssignmentCard({ task, weekNum, weekTitle, weekLocked, weekCompleted, onToggle }) {
  const type = guessTaskType(task.text);
  const config = TASK_TYPE_CONFIG[type];
  const Icon = config.icon;
  const effort = estimateEffort(task.text);

  let statusBg = task.completed ? 'rgba(5,150,105,0.04)' : weekLocked ? 'rgba(148,163,184,0.02)' : 'var(--bg-card)';
  let borderColor = task.completed ? 'rgba(5,150,105,0.2)' : weekLocked ? 'var(--border-light)' : 'var(--border-light)';

  return (
    <div
      style={{
        background: statusBg,
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${task.completed ? 'var(--success)' : weekLocked ? '#cbd5e1' : config.color}`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '10px',
        opacity: weekLocked ? 0.65 : 1,
        transition: 'all 0.2s ease',
        cursor: weekLocked ? 'not-allowed' : 'pointer',
      }}
      onClick={() => onToggle(task)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Checkbox Icon */}
        <div
          style={{
            width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
            border: `2px solid ${task.completed ? 'var(--success)' : weekLocked ? '#cbd5e1' : config.color}`,
            background: task.completed ? 'var(--success)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {task.completed && <Check size={13} color="white" style={{ strokeWidth: '3' }} />}
          {weekLocked && !task.completed && <Lock size={10} color="#94a3b8" />}
        </div>

        {/* Task icon */}
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${config.color}12`, border: `1px solid ${config.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: config.color }}>
          <Icon size={15} />
        </div>

        {/* Task text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)',
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.65 : 1,
            lineHeight: '1.45',
            margin: 0
          }}>
            {task.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: config.color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Icon size={10} /> {config.label}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={10} /> {effort}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Week {weekNum}: {weekTitle}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ flexShrink: 0 }}>
          {task.completed ? (
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--success)', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={10} style={{ strokeWidth: '3' }} /> Passed
            </span>
          ) : weekLocked ? (
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', background: 'var(--bg-slate)', border: '1px solid var(--border-light)', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={10} /> Locked
            </span>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: '600', color: config.color, background: `${config.color}10`, border: `1px solid ${config.color}25`, padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Play size={10} fill={config.color} style={{ stroke: 'none' }} /> Solve
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WEEK GROUP HEADER ─────────────────────────────────────────────────────
function WeekGroupHeader({ week, completedCount, totalCount, isExpanded, onToggle }) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = week.completed || pct === 100;
  const isActive = !week.locked && !isCompleted;
  const isLocked = week.locked;

  const statusColor = isCompleted ? 'var(--success)' : isActive ? 'var(--accent)' : '#94a3b8';
  const statusLabel = isCompleted ? '✓ Complete' : isActive ? '⚡ Active' : '🔒 Locked';

  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
        background: isActive ? 'rgba(8,145,178,0.03)' : isCompleted ? 'rgba(5,150,105,0.03)' : 'var(--bg-slate)',
        border: `1px solid ${isActive ? 'rgba(8,145,178,0.15)' : isCompleted ? 'rgba(5,150,105,0.15)' : 'var(--border-light)'}`,
        borderRadius: '12px', cursor: 'pointer', marginBottom: '8px',
        transition: 'all 0.2s ease', userSelect: 'none',
        opacity: isLocked ? 0.6 : 1
      }}
    >
      {/* Week dot */}
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: `${statusColor}15`, border: `2px solid ${statusColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: statusColor, fontFamily: 'var(--font-heading)' }}>
        {week.week}
      </div>

      {/* Title & progress */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {week.title}
          </h4>
          <span style={{ fontSize: '10px', fontWeight: '700', color: statusColor, background: `${statusColor}12`, border: `1px solid ${statusColor}25`, padding: '2px 8px', borderRadius: '10px' }}>
            {statusLabel}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--bg-slate)', borderRadius: '2px', overflow: 'hidden', maxWidth: '180px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: isCompleted ? 'var(--success)' : 'var(--primary)', borderRadius: '2px', transition: 'width 0.6s ease' }}></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {completedCount}/{totalCount} tasks
          </span>
        </div>
      </div>

      {/* Expand arrow */}
      <div style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function AssignmentsView() {
  const { roadmap, toggleTask, setCurrentView, studentProfile, pitchMode, streakCount, addNotification, setSkillScore } = useApp();

  const [filter, setFilter] = useState('all'); // all | pending | completed | locked
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedWeeks, setExpandedWeeks] = useState(() => {
    // Auto-expand all unlocked weeks
    const initial = {};
    if (roadmap) roadmap.forEach(w => { if (!w.locked) initial[w.week] = true; });
    return initial;
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Workspace Solving States
  const [activeTaskToSolve, setActiveTaskToSolve] = useState(null);

  // MCQ States
  const [answersSubmitted, setAnswersSubmitted] = useState({}); // { qIdx: selectedOptionIdx }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);

  // Coding States
  const [editorCode, setEditorCode] = useState("");
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [runningTests, setRunningTests] = useState(false);
  const [testsPassed, setTestsPassed] = useState(false);

  // Git Repo States
  const [repoUrl, setRepoUrl] = useState("");
  const [branchName, setBranchName] = useState("main");
  const [verifyingRepo, setVerifyingRepo] = useState(false);
  const [repoVerified, setRepoVerified] = useState(false);
  const [repoLogs, setRepoLogs] = useState([]);

  const toggleWeek = (weekNum) => setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));

  // Handle card click
  const handleCardClick = (task) => {
    if (task.weekLocked) return;

    if (task.completed) {
      // Toggle back to incomplete
      toggleTask(task.weekIndex, task.id);
      addNotification(`Reset assignment: "${task.text}"`);
    } else {
      // Open solver workspace!
      setActiveTaskToSolve(task);
      const taskType = guessTaskType(task.text);

      if (taskType === 'code' || taskType === 'practice') {
        const challenge = getCodingChallenge(task);
        setEditorCode(challenge.template);
        setTerminalLogs(["🐍 Monospaced Python IDE Console v3.12.0", ">>> Enter code in the editor on the left and click 'Run Compiler Tests' to check correctness."]);
        setRunningTests(false);
        setTestsPassed(false);
      } else if (taskType === 'read') {
        const weekIndex = task.weekNum || 1;
        const questions = WEEK_QUIZZES[((weekIndex - 1) % 8) + 1] || WEEK_QUIZZES[1];
        setCurrentQuizQuestions(questions);
        setAnswersSubmitted({});
        setQuizSubmitted(false);
        setQuizScore(0);
      } else if (taskType === 'build' || taskType === 'apply') {
        setRepoUrl("");
        setBranchName("main");
        setRepoVerified(false);
        setVerifyingRepo(false);
        setRepoLogs(["🔧 Git CI/CD Verification CLI v1.8.4", ">>> Enter repository URL and click 'Run Verification Check' to pull commit data."]);
      }
    }
  };

  // Submit MCQ Quiz
  const handleQuizSubmit = () => {
    let score = 0;
    currentQuizQuestions.forEach((q, idx) => {
      if (answersSubmitted[idx] === q.a) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 2) {
      addNotification(`Passed Assignment MCQ: ${activeTaskToSolve.text} (${score}/3)`);
    } else {
      addNotification(`⚠️ MCQ check failed: score too low (${score}/3). Try again.`);
    }
  };

  const finalizeQuizCompletion = () => {
    toggleTask(activeTaskToSolve.weekIndex, activeTaskToSolve.id);
    setSkillScore(prev => Math.min(100, prev + 2));
    setActiveTaskToSolve(null);
  };

  // Run simulated compiler tests
  const handleRunCompilerTests = () => {
    setRunningTests(true);
    setTerminalLogs(prev => [...prev, ">>> Initializing Python code interpreter sandbox...", ">>> Checking syntax trees and references..."]);
    
    setTimeout(() => {
      const challenge = getCodingChallenge(activeTaskToSolve);
      setTerminalLogs(prev => [
        ...prev,
        ...challenge.tests.slice(0, -1),
        `>>> compiler result: SUCCESS`,
        challenge.tests[challenge.tests.length - 1]
      ]);
      setRunningTests(false);
      setTestsPassed(true);
    }, 1500);
  };

  const finalizeCodingCompletion = () => {
    toggleTask(activeTaskToSolve.weekIndex, activeTaskToSolve.id);
    setSkillScore(prev => Math.min(100, prev + 3));
    addNotification(`💻 Completed Coding Assignment: "${activeTaskToSolve.text}"`);
    setActiveTaskToSolve(null);
  };

  // Run simulated Git check
  const handleVerifyRepo = () => {
    if (!repoUrl.includes("github.com")) {
      setRepoLogs(prev => [...prev, "❌ Error: Invalid repository domain. Please submit a valid github.com repository path."]);
      return;
    }
    setVerifyingRepo(true);
    setRepoLogs(prev => [...prev, `>>> Connecting to remote host github.com...`, `>>> Cloning git repository: ${repoUrl} [branch: ${branchName}]...`]);

    setTimeout(() => {
      setRepoLogs(prev => [
        ...prev,
        `>>> Fetching repository branches... Found branch '${branchName}'`,
        `>>> Analyzing directory structure: found project dependencies and documentation files.`,
        `>>> Parsing commit history: Verified 8 student commits.`,
        `>>> Run check: Build compiled with zero errors.`,
        `>>> Result: VERIFICATION SUCCESSFUL! Git branch pushes verified.`
      ]);
      setVerifyingRepo(false);
      setRepoVerified(true);
    }, 1800);
  };

  const finalizeGitCompletion = () => {
    toggleTask(activeTaskToSolve.weekIndex, activeTaskToSolve.id);
    setSkillScore(prev => Math.min(100, prev + 3));
    addNotification(`🚀 Repository pushes successfully validated for: "${activeTaskToSolve.text}"`);
    setActiveTaskToSolve(null);
  };

  // Flatten all tasks from all weeks into a single list with metadata
  const allAssignments = useMemo(() => {
    if (!roadmap || roadmap.length === 0) return [];
    const flat = [];
    roadmap.forEach(week => {
      week.tasks.forEach(task => {
        flat.push({
          ...task,
          weekNum: week.week,
          weekTitle: week.title,
          weekLocked: week.locked,
          weekCompleted: week.completed,
          weekIndex: roadmap.indexOf(week),
          type: guessTaskType(task.text),
        });
      });
    });
    return flat;
  }, [roadmap]);

  // Stats
  const totalTasks = allAssignments.length;
  const completedTasks = allAssignments.filter(t => t.completed).length;
  const pendingTasks = allAssignments.filter(t => !t.completed && !t.weekLocked).length;
  const lockedTasks = allAssignments.filter(t => t.weekLocked).length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter logic
  const filteredWeeks = useMemo(() => {
    if (!roadmap) return [];
    return roadmap.map(week => {
      let tasks = week.tasks.map(t => ({
        ...t,
        weekNum: week.week,
        weekTitle: week.title,
        weekLocked: week.locked,
        weekCompleted: week.completed,
        weekIndex: roadmap.indexOf(week),
        type: guessTaskType(t.text),
      }));

      // Apply status filter
      if (filter === 'pending') tasks = tasks.filter(t => !t.completed && !week.locked);
      if (filter === 'completed') tasks = tasks.filter(t => t.completed);
      if (filter === 'locked') tasks = tasks.filter(() => week.locked);

      // Apply type filter
      if (typeFilter !== 'all') tasks = tasks.filter(t => t.type === typeFilter);

      // Apply search
      if (searchQuery.trim()) {
        tasks = tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()) || week.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      return { week, tasks };
    }).filter(({ tasks }) => tasks.length > 0);
  }, [roadmap, filter, typeFilter, searchQuery]);

  // ── Empty state (no roadmap yet) ──────────────────────────────────────────
  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="animate-slide-up" style={{ padding: '0' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>My Assignments & Tests</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            All tasks from your personalized roadmap — organized into structured assignments.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '72px 32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <ClipboardList size={60} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: '20px' }} />
          <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>No Assignments Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 28px auto', lineHeight: '1.7' }}>
            Your assignments are pulled from your personalized roadmap. First, run the <strong>AI Skill Gap Analyzer</strong> and generate your roadmap.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setCurrentView('gap-analyzer')}>
              <Sparkles size={15} /> Run Skill Gap Analysis
            </button>
            <button className="btn-primary" onClick={() => setCurrentView('roadmap')}>
              <GitMerge size={15} /> Generate My Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  const solverTaskType = activeTaskToSolve ? guessTaskType(activeTaskToSolve.text) : 'read';

  return (
    <div className="animate-slide-up">
      {/* Pitch Mode tip */}
      {pitchMode && (
        <div className="pitch-mode-guideline-card">
          <AlertCircle size={20} style={{ flexShrink: 0, color: 'var(--warning)' }} />
          <div>
            <strong>Judge Tip:</strong> All roadmap tasks appear here as structured assignments.
            Click any task to launch the <strong>Interactive Assignment Sandbox</strong>.
            Solve coding challenges, complete conceptual check quizzes, or submit GitHub repos to earn score boosts!
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ClipboardList size={28} style={{ color: 'var(--primary)' }} />
            My Assignments & Tests
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            All tasks from your personalized roadmap — solve the hands-on tests to pass each requirement.
          </p>
        </div>
        <button className="btn-secondary" onClick={() => setCurrentView('roadmap')} style={{ fontSize: '13px', gap: '6px', whiteSpace: 'nowrap' }}>
          <GitMerge size={14} /> View Full Roadmap
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Total Assignments', val: totalTasks, color: 'var(--primary)', icon: ClipboardList, bg: 'rgba(99,102,241,0.05)', border: 'rgba(99,102,241,0.15)' },
          { label: 'Completed', val: completedTasks, color: 'var(--success)', icon: CheckCircle2, bg: 'rgba(5,150,105,0.05)', border: 'rgba(5,150,105,0.15)' },
          { label: 'In Progress', val: pendingTasks, color: 'var(--accent)', icon: Zap, bg: 'rgba(8,145,178,0.05)', border: 'rgba(8,145,178,0.15)' },
          { label: 'Locked', val: lockedTasks, color: '#94a3b8', icon: Lock, bg: 'var(--bg-slate)', border: 'var(--border-light)' },
          { label: 'Overall Progress', val: `${completionPct}%`, color: completionPct >= 80 ? 'var(--success)' : completionPct >= 50 ? 'var(--warning)' : 'var(--primary)', icon: BarChart3, bg: 'rgba(99,102,241,0.03)', border: 'rgba(99,102,241,0.1)' },
        ].map(({ label, val, color, icon: Icon, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '14px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Icon size={15} style={{ color }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color, fontFamily: 'var(--font-heading)' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-panel" style={{ padding: '18px 22px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
            🎯 Overall Assignment Progress — {studentProfile.targetRole}
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{completedTasks}/{totalTasks} done</span>
        </div>
        <div style={{ height: '10px', background: 'var(--bg-slate)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${completionPct}%`,
            background: completionPct >= 80
              ? 'linear-gradient(90deg, var(--success), #22d3ee)'
              : 'linear-gradient(90deg, var(--primary), var(--accent))',
            borderRadius: '5px', transition: 'width 1s ease'
          }}></div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
          {completionPct >= 100 && <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600' }}>🏆 All assignments complete! You're job ready!</span>}
          {completionPct >= 50 && completionPct < 100 && <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '600' }}>🔥 Great progress! Keep up the momentum!</span>}
          {completionPct < 50 && <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>💪 You're building your future — keep going!</span>}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={12} fill="var(--warning)" style={{ stroke: 'none', color: 'var(--warning)' }} /> {streakCount} day streak
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '9px 14px 9px 36px', borderRadius: '10px',
              border: '1px solid var(--border-light)', background: 'var(--bg-card)',
              color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-heading)',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
          <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All (${totalTasks})` },
            { key: 'pending', label: `Pending (${pendingTasks})` },
            { key: 'completed', label: `Done (${completedTasks})` },
            { key: 'locked', label: `Locked (${lockedTasks})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'var(--font-heading)',
                background: filter === key ? 'var(--primary)' : 'var(--bg-slate)',
                color: filter === key ? 'white' : 'var(--text-secondary)',
                border: filter === key ? 'none' : '1px solid var(--border-light)',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
          <button
            onClick={() => setTypeFilter('all')}
            style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-heading)', background: typeFilter === 'all' ? 'var(--bg-slate)' : 'transparent', color: typeFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)', border: '1px solid var(--border-light)' }}
          >
            All Types
          </button>
          {Object.entries(TASK_TYPE_CONFIG).map(([key, cfg]) => {
            const TIcon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                style={{
                  padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'var(--font-heading)',
                  background: typeFilter === key ? `${cfg.color}12` : 'transparent',
                  color: typeFilter === key ? cfg.color : 'var(--text-muted)',
                  border: typeFilter === key ? `1px solid ${cfg.color}30` : '1px solid var(--border-light)',
                  display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s ease'
                }}
              >
                <TIcon size={11} /> {cfg.label.replace(' Task', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* No results */}
      {filteredWeeks.length === 0 && (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <ClipboardList size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No assignments match your current filters.</p>
          <button onClick={() => { setFilter('all'); setTypeFilter('all'); setSearchQuery(''); }} style={{ marginTop: '12px', background: 'none', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: 'var(--primary)' }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Assignment Groups by Week */}
      {filteredWeeks.map(({ week, tasks }) => (
        <div key={week.week} style={{ marginBottom: '16px' }}>
          <WeekGroupHeader
            week={week}
            completedCount={week.tasks.filter(t => t.completed).length}
            totalCount={week.tasks.length}
            isExpanded={!!expandedWeeks[week.week]}
            onToggle={() => toggleWeek(week.week)}
          />

          {expandedWeeks[week.week] && (
            <div style={{ paddingLeft: '12px', borderLeft: '2px solid var(--border-light)', marginLeft: '17px', paddingTop: '4px' }}>
              {/* Week info header */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px', paddingLeft: '8px' }}>
                {week.topics?.map((topic, i) => (
                  <span key={i} className="badge-glow" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{topic}</span>
                ))}
              </div>

              {/* Tasks */}
              {tasks.map(task => (
                <AssignmentCard
                  key={task.id}
                  task={task}
                  weekNum={week.week}
                  weekTitle={week.title}
                  weekLocked={week.locked}
                  weekCompleted={week.completed}
                  onToggle={handleCardClick}
                />
              ))}

              {/* All done message for unlocked weeks */}
              {!week.locked && week.tasks.every(t => t.completed) && (
                <div style={{ padding: '12px 16px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: '10px', fontSize: '13px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Trophy size={15} /> Week {week.week} fully complete! Next week has been unlocked.
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Bottom Achievement Section */}
      {completedTasks > 0 && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-light)', marginTop: '24px', background: 'rgba(99,102,241,0.02)' }}>
          <h4 style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={16} style={{ color: 'var(--warning)' }} /> Achievement Summary
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Coding Tasks Done', count: allAssignments.filter(t => t.completed && t.type === 'code').length, total: allAssignments.filter(t => t.type === 'code').length, color: '#6366f1' },
              { label: 'Projects Built', count: allAssignments.filter(t => t.completed && t.type === 'build').length, total: allAssignments.filter(t => t.type === 'build').length, color: '#a855f7' },
              { label: 'Study Tasks Done', count: allAssignments.filter(t => t.completed && t.type === 'read').length, total: allAssignments.filter(t => t.type === 'read').length, color: '#0891b2' },
              { label: 'Practice Done', count: allAssignments.filter(t => t.completed && t.type === 'practice').length, total: allAssignments.filter(t => t.type === 'practice').length, color: '#d97706' },
            ].map(({ label, count, total, color }) => (
              <div key={label} style={{ background: 'var(--bg-slate)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color, fontFamily: 'var(--font-heading)' }}>{count}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/{total}</span></div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setCurrentView('mock-interview')} style={{ fontSize: '13px', gap: '6px' }}>
              <Play size={13} fill="white" style={{ stroke: 'none' }} /> Take Mock Interview
            </button>
            <button className="btn-secondary" onClick={() => setCurrentView('roadmap')} style={{ fontSize: '13px', gap: '6px' }}>
              <GitMerge size={13} /> View Full Roadmap
            </button>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE WORKSPACE MODAL OVERLAY ───────────────────────────────── */}
      {activeTaskToSolve && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(6px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box'
        }}>
          {/* Modal Container */}
          <div className="glass-panel animate-scale-up" style={{
            width: '100%', maxWidth: '980px', height: '90vh', maxHeight: '720px',
            display: 'flex', flexDirection: 'column', background: 'var(--bg-card)',
            borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden',
            boxShadow: '0 24px 38px 3px rgba(15, 23, 42, 0.12), 0 9px 46px 8px rgba(15, 23, 42, 0.08)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '18px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-slate)'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} fill="var(--primary)" style={{ stroke: 'none' }} /> Week {activeTaskToSolve.weekNum} Assignment Workspace
                </span>
                <h3 style={{ fontSize: '18px', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
                  {activeTaskToSolve.text}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskToSolve(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Split Content Panels */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Column: Context / Descriptions */}
              <div style={{
                width: '320px', borderRight: '1px solid var(--border-light)', padding: '24px',
                overflowY: 'auto', background: 'rgba(241, 245, 249, 0.4)', boxSizing: 'border-box'
              }}>
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Assignment Goal
                </h4>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '24px' }}>
                  {solverTaskType === 'code' || solverTaskType === 'practice'
                    ? getCodingChallenge(activeTaskToSolve).description
                    : solverTaskType === 'read'
                    ? "Pass this conceptual test by selecting the correct answer for each of the three multiple-choice questions below. A passing score of 2/3 is required to complete this assignment."
                    : "Confirm your version control setups. Input your project's GitHub Repository URL and branch name. We will run an automated script checking file hierarchy and git logs."
                  }
                </p>

                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Skills Assessed
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {activeTaskToSolve.weekTitle.split('&').map(s => (
                    <span key={s} className="badge-glow" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px' }}>
                      {s.trim()}
                    </span>
                  ))}
                  <span className="badge-cyan" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px' }}>
                    {solverTaskType === 'code' ? 'Algorithmic Logic' : solverTaskType === 'read' ? 'Key Concepts' : 'CI/CD Pipelines'}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-slate)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '14px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    <Star size={14} style={{ color: 'var(--warning)' }} /> Complete to Gain:
                  </div>
                  <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <li>+{solverTaskType === 'code' ? '3%' : '2%'} overall placement readiness</li>
                    <li>Synchronized checklist ticks on roadmap</li>
                    <li>Skills verification certificate logs</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Dynamic Playground Workspace */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxSizing: 'border-box' }}>
                {/* 1. CODE PLAYGROUND */}
                {(solverTaskType === 'code' || solverTaskType === 'practice') && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '14px', minHeight: 0 }}>
                    {/* IDE Sandbox Editor */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#1e293b', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', borderBottom: '1px solid #334155' }}>
                        <span style={{ fontSize: '12px', color: '#cbd5e1', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Code2 size={13} color="#818cf8" /> main.py — Sandbox Workspace
                        </span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                        </div>
                      </div>
                      <textarea
                        value={editorCode}
                        onChange={(e) => setEditorCode(e.target.value)}
                        disabled={testsPassed}
                        style={{
                          flex: 1, background: '#0f172a', color: '#f8fafc',
                          fontFamily: "'Courier New', Courier, monospace", fontSize: '13px',
                          padding: '16px', border: '1px solid #334155', borderTop: 'none',
                          borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px',
                          outline: 'none', resize: 'none', lineHeight: '1.6'
                        }}
                      />
                    </div>

                    {/* Console Logger output */}
                    <div style={{ height: '140px', background: '#020617', borderRadius: '10px', border: '1px solid #1e293b', padding: '12px 16px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '6px' }}>
                        <Terminal size={12} /> Execution Outputs logs
                      </div>
                      {terminalLogs.map((log, idx) => (
                        <div key={idx} style={{
                          fontFamily: "monospace", fontSize: '12px',
                          color: log.includes("PASSED") || log.includes("passed!") || log.includes("SUCCESS") ? '#10b981' : log.includes("Error") ? '#ef4444' : '#e2e8f0',
                          lineHeight: '1.4'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Control Row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      {!testsPassed ? (
                        <button
                          className="btn-primary"
                          onClick={handleRunCompilerTests}
                          disabled={runningTests}
                          style={{ minWidth: '150px' }}
                        >
                          {runningTests ? 'Running Sandbox...' : 'Run Compiler Tests'}
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={finalizeCodingCompletion}
                          style={{ minWidth: '150px', animation: 'pulseGreen 2s infinite' }}
                        >
                          Submit & Claim Score
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. CONCEPT QUIZ WORKSPACE */}
                {solverTaskType === 'read' && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '20px' }}>
                    {/* Questions loop */}
                    {currentQuizQuestions.map((q, qIdx) => {
                      const isAnswered = answersSubmitted[qIdx] !== undefined;
                      const selectedOpt = answersSubmitted[qIdx];
                      const correctOpt = q.a;

                      return (
                        <div key={qIdx} style={{ background: 'var(--bg-slate)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '18px 20px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', gap: '8px', color: 'var(--text-primary)' }}>
                            <span style={{ color: 'var(--primary)' }}>Q{qIdx + 1}.</span> {q.q}
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            {q.o.map((opt, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = optIdx === correctOpt;

                              let btnBorder = '1px solid var(--border-light)';
                              let btnBg = 'var(--bg-card)';
                              let btnColor = 'var(--text-secondary)';

                              if (isAnswered) {
                                if (isSelected) {
                                  if (isCorrect) {
                                    btnBorder = '1px solid var(--success)';
                                    btnBg = 'rgba(5, 150, 105, 0.08)';
                                    btnColor = 'var(--success)';
                                  } else {
                                    btnBorder = '1px solid var(--danger)';
                                    btnBg = 'rgba(220, 38, 38, 0.08)';
                                    btnColor = 'var(--danger)';
                                  }
                                } else if (isCorrect) {
                                  // Reveal correct answer if user got it wrong
                                  btnBorder = '1px solid var(--success)';
                                  btnBg = 'rgba(5, 150, 105, 0.04)';
                                  btnColor = 'var(--success)';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isAnswered}
                                  onClick={() => setAnswersSubmitted(prev => ({ ...prev, [qIdx]: optIdx }))}
                                  style={{
                                    textAlign: 'left', padding: '12px 16px', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: '500', background: btnBg, border: btnBorder, color: btnColor,
                                    cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.15s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                  }}
                                >
                                  {opt}
                                  {isAnswered && isSelected && isCorrect && <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Correct ✓</span>}
                                  {isAnswered && isSelected && !isCorrect && <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Incorrect ✗</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Show explanation if answered */}
                          {isAnswered && (
                            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-light)', paddingTop: '8px', display: 'flex', gap: '6px' }}>
                              <span>💡</span> <span>{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Quiz Submission result */}
                    {Object.keys(answersSubmitted).length === currentQuizQuestions.length && (
                      <div style={{
                        marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '14px',
                        padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)',
                        background: quizSubmitted ? (quizScore >= 2 ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)') : 'var(--bg-slate)'
                      }}>
                        {quizSubmitted ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {quizScore >= 2 ? (
                                <>
                                  <Trophy size={22} style={{ color: 'var(--success)' }} />
                                  <div>
                                    <h4 style={{ fontSize: '15px', color: 'var(--success)', fontWeight: 'bold', margin: 0 }}>Concept Check Passed!</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Score: {quizScore}/3 correct questions.</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle size={22} style={{ color: 'var(--danger)' }} />
                                  <div>
                                    <h4 style={{ fontSize: '15px', color: 'var(--danger)', fontWeight: 'bold', margin: 0 }}>Conceptual Check Failed</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Score: {quizScore}/3 correct. Minimum of 2 correct answers needed to pass.</p>
                                  </div>
                                </>
                              )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                              {quizScore >= 2 ? (
                                <button className="btn-success" onClick={finalizeQuizCompletion}>
                                  Claim Concept Badge & Close
                                </button>
                              ) : (
                                <button className="btn-secondary" onClick={() => { setAnswersSubmitted({}); setQuizSubmitted(false); setQuizScore(0); }}>
                                  Retry Quiz Check
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>All questions answered. Validate score?</span>
                            <button className="btn-primary" onClick={handleQuizSubmit}>
                              Submit and Grade
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. GIT REPOSITORY VERIFICATION */}
                {(solverTaskType === 'build' || solverTaskType === 'apply') && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '20px' }}>
                    <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-light)' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: 'var(--text-primary)' }}>
                        GitHub Integration pipeline
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Repository URL (github.com)
                          </label>
                          <input
                            type="text"
                            placeholder="https://github.com/username/repository-name"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            disabled={repoVerified}
                            style={{
                              width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)',
                              background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Push Branch Name
                          </label>
                          <input
                            type="text"
                            placeholder="main"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            disabled={repoVerified}
                            style={{
                              width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)',
                              background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Console checkout display */}
                    <div style={{ height: '150px', background: '#020617', borderRadius: '10px', border: '1px solid #1e293b', padding: '12px 16px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '6px' }}>
                        <Terminal size={12} /> Git Connection Logs
                      </div>
                      {repoLogs.length === 0 && (
                        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                          Console waiting. Submit your repository configuration to trigger check.
                        </div>
                      )}
                      {repoLogs.map((log, idx) => (
                        <div key={idx} style={{
                          fontFamily: "monospace", fontSize: '12px',
                          color: log.includes("VERIFICATION SUCCESSFUL") || log.includes("Verified") ? '#10b981' : log.includes("Error") ? '#ef4444' : '#cbd5e1',
                          lineHeight: '1.4'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      {!repoVerified ? (
                        <button
                          className="btn-primary"
                          onClick={handleVerifyRepo}
                          disabled={verifyingRepo || !repoUrl.trim()}
                          style={{ minWidth: '150px' }}
                        >
                          {verifyingRepo ? 'Analyzing Repository...' : 'Run Verification Check'}
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={finalizeGitCompletion}
                          style={{ minWidth: '150px', animation: 'pulseGreen 2s infinite' }}
                        >
                          Finalize Submission
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Animations styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}} />
    </div>
  );
}
