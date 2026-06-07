import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Analysis from '../models/Analysis.js';

const prompt = (resumeText, jobDescription) => `
You are a professional resume analyzer.
Analyze the resume against the job description.
Return ONLY a JSON object with this exact structure:
{
  "matchScore": number between 0-100,
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

// Try Groq
const tryGroq = async (resumeText, jobDesc) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const res = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt(resumeText, jobDesc) }],
    temperature: 0.3
  });
  return res.choices[0].message.content;
};

// Try Gemini
const tryGemini = async (resumeText, jobDesc) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const res = await model.generateContent(prompt(resumeText, jobDesc));
  return res.response.text();
};

// Try OpenAI
const tryOpenAI = async (resumeText, jobDesc) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt(resumeText, jobDesc) }],
    temperature: 0.3
  });
  return res.choices[0].message.content;
};

export const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    let raw = null;

    // Fallback chain
    try {
      console.log('Trying Groq...');
      raw = await tryGroq(resumeText, jobDescription);
    } catch (e) {
      console.log('Groq failed, trying Gemini...');
      try {
        raw = await tryGemini(resumeText, jobDescription);
      } catch (e2) {
        console.log('Gemini failed, trying OpenAI...');
        raw = await tryOpenAI(resumeText, jobDescription);
      }
    }

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);

    await Analysis.create({
      resumeText,
      jobDescription,
      matchScore: result.matchScore,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};