# SkillForge AI 🚀

> **National Hackathon 2026 Submission** — AI-powered career readiness platform bridging the gap between degrees and careers.

---

## 🎯 What is SkillForge AI?

SkillForge AI is a full-featured career intelligence platform that helps students go from degree to dream job using Google Gemini AI. It identifies skill gaps, builds personalised roadmaps, coaches mock interviews, analyses resumes for ATS compatibility, and incubates startup ideas — all in one unified dashboard.

---

## ⚡ Quick Start for Judges

```bash
npm install
npm run dev
```

Then visit `http://localhost:5173`

**→ Click the glowing "⚡ One-Click Judge Demo" button on the Auth page to instantly access the full dashboard.**

Or sign in manually:
- **Email:** `saransh@technonjr.org`
- **Password:** `demo1234`

---

## 🔑 Environment Setup

Create a `.env` file in the root:

```
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

> **Note:** If no API key is set, the app gracefully falls back to demo data for all AI features — the full UI is still explorable.

---

## 🧩 Features

| Module | Description |
|---|---|
| 🔍 **AI Skill Gap Analyzer** | Gemini-powered real-time skill gap analysis against live industry benchmarks |
| 🗺️ **Personalised Roadmap** | 8-week AI-generated week-by-week learning curriculum with task checklists |
| 💻 **AI Project Board** | Curated coding projects with an in-browser IDE sandbox and unit-test verification |
| 🎙️ **Mock Interview Engine** | Technical & HR interview simulation with detailed AI scoring and improvement tips |
| 📄 **Resume ATS Scanner** | NLP-based ATS compatibility scoring with auto keyword injection |
| 📊 **Industry Readiness Dashboard** | Composite readiness score with Recharts visualisations and a verified certificate |
| 🚀 **Startup Launchpad** | Gemini-generated Business Model Canvas, 12-week MVP plan, and pitch deck |
| 🤖 **AI Career Coach Chatbot** | Persistent floating Gemini-powered chatbot for contextual career advice |
| 🏫 **Institution Dashboard** | University-level analytics with departmental leaderboards and placement registries |
| 🛡️ **Admin Console** | Platform diagnostics terminal and user management panel |

---

## 🏗️ Tech Stack

- **Frontend:** React 19, Vite 8
- **AI:** Google Gemini 2.0 Flash (`@google/genai`)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** LocalStorage (demo database — no backend required)
- **Styling:** Pure CSS with custom design system (dark theme, glassmorphism)

---

## 👥 Roles to Demo

Switch between roles using the navbar selector (visible when logged in):

| Role | What to Show |
|---|---|
| **Student** | Full career readiness journey — gap analysis → roadmap → interview → certificate |
| **College** | Institution analytics, departmental leaderboards, placement registries |
| **Admin** | Platform diagnostics terminal, user management table |

---

## 📁 Project Structure

```
src/
├── components/        # Navbar, Sidebar, AIAssistant chatbot
├── context/           # AppContext — global state, auth, DB sync
├── services/          # geminiService.js, dbService.js (LocalStorage)
└── views/             # All page views (12 views)
```

---

*Built with ❤️ for the 2026 National Hackathon · Powered by Google Gemini AI*
