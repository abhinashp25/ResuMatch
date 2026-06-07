import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Groq from 'groq-sdk';
import Analysis from '../models/Analysis.js';

export const analyzeResume = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const { jobDescription } = req.body;
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const prompt = `
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

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const raw = response.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);

    const saved = await Analysis.create({
      resumeText,
      jobDescription,
      matchScore: result.matchScore,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions
    });

    res.json({ success: true, data: result, id: saved._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};