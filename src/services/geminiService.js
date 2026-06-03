// src/services/geminiService.js
// Centralized Google Gemini AI Service for SkillForge AI

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Core helper — sends a prompt to Gemini and returns the text response.
 */
async function callGemini(prompt) {
  const response = await fetch(`${API_BASE}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * 1. Analyzes skill gaps for a given role and skills list.
 * Returns: { existing, missing, courses, score, roadmapNote }
 */
export async function analyzeSkillGap(skills, targetRole) {
  const prompt = `You are SkillForge AI, an expert career coach for tech students.

A student wants to become a "${targetRole}". Their current skills are: ${skills.join(', ')}.

Respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "existing": ["skill1", "skill2"],
  "missing": ["skill3", "skill4", "skill5"],
  "score": 65,
  "roadmapNote": "One sentence about what to focus on first.",
  "courses": [
    { "title": "Course title", "reason": "Why this course addresses a gap" },
    { "title": "Course title 2", "reason": "Why this course addresses a gap" }
  ]
}

Rules:
- "existing" = skills from their list that ARE relevant for the target role
- "missing" = 4-6 important skills they are missing for the role
- "score" = integer 0-100 representing how ready they are (be realistic)
- Keep all values concise and practical`;

  const raw = await callGemini(prompt);
  
  // Strip any accidental markdown code fences
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * 2. Career chatbot — context-aware response for the AI assistant.
 * Returns: string (the AI's reply, may include markdown bold **)
 */
export async function getChatResponse(userMessage, context) {
  const { studentName, targetRole, skillScore, currentView, gapAnalysis } = context;

  const prompt = `You are a friendly, expert career coach AI inside SkillForge AI platform.

Student profile:
- Name: ${studentName}
- Target role: ${targetRole}
- Skill score: ${skillScore}%
- Currently viewing: ${currentView}
- Skills analyzed: ${gapAnalysis?.analyzed ? 'Yes, score ' + gapAnalysis.score + '%' : 'Not yet analyzed'}

The student asks: "${userMessage}"

Respond helpfully and concisely (3-5 sentences max). Use **bold** for key terms.
Be encouraging, specific to their profile, and actionable.
Do not use bullet lists with hyphens — use line breaks between points instead.`;

  return await callGemini(prompt);
}

/**
 * 3. Generates a full Business Model Canvas from startup inputs.
 * Returns: { valueProp, segments, channels, activities, partners, costs, revenues, mvp[], viability, pitchSlides[] }
 */
export async function generateBusinessCanvas(name, problem, audience) {
  const prompt = `You are a startup incubator AI inside SkillForge AI platform.

A student has a startup idea:
- Name: "${name}"
- Problem: "${problem}"
- Target audience: "${audience}"

Respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "valueProp": "One clear sentence value proposition",
  "segments": "Customer segments description",
  "channels": "Distribution channels",
  "activities": "Key activities",
  "partners": "Key partners",
  "costs": "Cost structure overview",
  "revenues": "Revenue streams",
  "viability": 72,
  "mvp": [
    { "phase": "Weeks 1-2", "task": "Specific actionable task" },
    { "phase": "Weeks 3-4", "task": "Specific actionable task" },
    { "phase": "Weeks 5-8", "task": "Specific actionable task" },
    { "phase": "Weeks 9-12", "task": "Specific actionable task" }
  ],
  "pitchSlides": [
    { "slide": "The Hook", "content": "Opening one-liner pitch" },
    { "slide": "The Problem", "content": "Problem description" },
    { "slide": "The Solution", "content": "Your innovation" },
    { "slide": "Revenue Model", "content": "How you make money" }
  ]
}

Rules:
- "viability" = integer 0-100 (be realistic, 60-85 for most student ideas)
- Keep all values concise and realistic for a student startup`;

  const raw = await callGemini(prompt);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * 4. Generates a personalized 8-week roadmap based on skill gaps.
 * Returns: array of week objects matching the roadmap schema
 */
export async function generatePersonalizedRoadmap(missingSkills, targetRole, currentSkills) {
  const prompt = `You are a career roadmap planner AI inside SkillForge AI.

A student wants to become a "${targetRole}".
Their current skills: ${currentSkills.join(', ')}.
Skills they are missing: ${missingSkills.join(', ')}.

Generate a personalized 8-week learning roadmap to close these gaps.
Respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
[
  {
    "week": 1,
    "title": "Week topic title",
    "description": "Brief description of what this week covers",
    "topics": ["Topic 1", "Topic 2", "Topic 3"],
    "tasks": [
      { "id": "w1-t1", "text": "Specific actionable task", "completed": false },
      { "id": "w1-t2", "text": "Specific actionable task", "completed": false }
    ],
    "completed": false,
    "locked": false
  }
]

Rules:
- Generate exactly 8 weeks
- Focus on the missing skills, distributed logically over 8 weeks
- Week 1 should be foundational (always unlocked, locked=false)
- Week 2 should also be unlocked (locked=false), weeks 3-8 should have locked=true
- Each week should have 2-3 practical tasks
- Tasks should be very specific and actionable (not generic)
- Keep all text concise and professional`;

  const raw = await callGemini(prompt);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const roadmap = JSON.parse(cleaned);
  // Ensure correct ID format for tasks
  return roadmap.map((week, wIdx) => ({
    ...week,
    tasks: week.tasks.map((task, tIdx) => ({
      ...task,
      id: `w${week.week}-t${tIdx + 1}`,
      completed: false
    })),
    completed: false,
    locked: week.week > 2
  }));
}
