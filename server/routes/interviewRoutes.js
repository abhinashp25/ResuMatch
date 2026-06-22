import express from 'express';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import InterviewChecklist from '../models/InterviewChecklist.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { companyPrepLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

const DEFAULT_CHECKLIST = [
  { id: 1, text: 'Research the company — mission, product, recent news.',              done: false },
  { id: 2, text: 'Align your resume keywords with the job description.',               done: false },
  { id: 3, text: 'Prepare 3 STAR stories covering leadership, conflict, and delivery.', done: false },
  { id: 4, text: 'Test camera, mic, lighting, and internet connection.',               done: false },
  { id: 5, text: 'Prepare 3 thoughtful questions to ask the interviewer.',             done: false },
  { id: 6, text: 'Have a copy of your resume open during the interview.',              done: false },
];

// ─── Build the AI prompt for company-specific interview prep ─────────────────
function buildCompanyPrepPrompt(companyName, jobRole, skills) {
  return `
You are a senior software engineer and expert interview coach with deep knowledge of hiring processes at top companies worldwide.

Generate a detailed, SPECIFIC interview preparation guide for:
- Company: ${companyName}
- Role: ${jobRole}
- Candidate's key skills: ${skills.join(', ')}

Return ONLY a valid JSON object with EXACTLY this structure (no markdown, no extra text):
{
  "overview": "2–3 sentence description of ${companyName}'s culture, engineering bar, and what they look for in candidates for this role.",
  "interviewProcess": [
    "Round 1: ...",
    "Round 2: ...",
    "Round 3: ..."
  ],
  "technicalQuestions": [
    { "q": "A real technical question ${companyName} asks for a ${jobRole} role", "tip": "How to approach and structure your answer" },
    { "q": "...", "tip": "..." },
    { "q": "...", "tip": "..." },
    { "q": "...", "tip": "..." },
    { "q": "...", "tip": "..." }
  ],
  "behavioralQuestions": [
    { "q": "A real behavioral question ${companyName} commonly asks", "tip": "STAR-based answer guidance specific to this question" },
    { "q": "...", "tip": "..." },
    { "q": "...", "tip": "..." }
  ],
  "insiderTips": [
    "Specific, actionable tip about ${companyName}'s hiring process",
    "Another tip about what ${companyName} values in candidates",
    "A culture / fit tip specific to ${companyName}",
    "What to study or prepare specifically for this role at ${companyName}"
  ],
  "keyTechnologies": ["Tech1", "Tech2", "Tech3", "Tech4", "Tech5"]
}

CRITICAL RULES:
1. Every question and tip MUST be SPECIFIC to ${companyName} — no generic questions.
2. The interview process must reflect how ${companyName} actually interviews.
3. Technical questions should match both the company's known focus areas AND the candidate's skill set.
4. Keep answers practical and actionable, not vague.
`;
}

// ─── AI call helpers (Groq → Gemini → OpenAI fallback) ───────────────────────

async function callGroq(prompt) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const res = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1500,
  });
  return res.choices[0].message.content;
}

async function callGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const res = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 1500 },
  });
  return res.response.text();
}

async function callOpenAI(prompt) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1500,
  });
  return res.choices[0].message.content;
}

// ─── GET /api/interview/checklist ─────────────────────────────────────────────
router.get('/checklist', verifyToken, async (req, res) => {
  try {
    let checklist = await InterviewChecklist.findOne({ userId: req.user.uid });
    if (!checklist) {
      // Seed the default checklist for first-time users
      checklist = await InterviewChecklist.create({
        userId: req.user.uid,
        items: DEFAULT_CHECKLIST,
      });
    }
    res.json({ success: true, data: checklist.items });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch checklist' });
  }
});

// ─── PUT /api/interview/checklist ─────────────────────────────────────────────
router.put('/checklist', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items must be an array' });
    }

    let checklist = await InterviewChecklist.findOne({ userId: req.user.uid });
    if (!checklist) {
      checklist = new InterviewChecklist({ userId: req.user.uid, items });
    } else {
      checklist.items = items;
    }

    await checklist.save();
    res.json({ success: true, data: checklist.items });
  } catch (error) {
    console.error('Error updating checklist:', error);
    res.status(500).json({ success: false, message: 'Failed to update checklist' });
  }
});

// ─── POST /api/interview/company-prep ─────────────────────────────────────────
// Generates a company-specific interview prep guide using AI.
router.post('/company-prep', verifyToken, companyPrepLimiter, async (req, res) => {
  try {
    const { companyName, jobRole, skills } = req.body;

    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }
    if (!jobRole || typeof jobRole !== 'string' || jobRole.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Job role is required' });
    }

    const safeCompanyName = companyName.trim().slice(0, 100);
    const safeJobRole     = jobRole.trim().slice(0, 100);
    const safeSkills      = Array.isArray(skills)
      ? skills.map(s => String(s).trim()).filter(Boolean).slice(0, 20)
      : [];

    const prompt = buildCompanyPrepPrompt(safeCompanyName, safeJobRole, safeSkills);

    let rawOutput = null;

    // Groq → Gemini → OpenAI fallback chain
    try {
      rawOutput = await callGroq(prompt);
    } catch (e) {
      console.warn(`Groq failed for company-prep (${safeCompanyName}): ${e.message}. Trying Gemini...`);
      try {
        rawOutput = await callGemini(prompt);
      } catch (e2) {
        console.warn(`Gemini failed for company-prep (${safeCompanyName}): ${e2.message}. Trying OpenAI...`);
        rawOutput = await callOpenAI(prompt);
      }
    }

    if (!rawOutput) {
      throw new Error('All AI providers failed for company prep.');
    }

    // Extract the JSON block from the AI response
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI returned an invalid format (no JSON block found)');
    }

    const prep = JSON.parse(jsonMatch[0]);

    res.json({ success: true, data: prep });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in company-prep for user ${req.user?.uid}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate company prep guide. Please try again.',
    });
  }
});

export default router;

