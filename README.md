# 🤖 AI Resume Analyzer

An AI-powered full-stack web application that analyzes your resume against any job description — giving you a match score, missing keywords, and actionable suggestions to improve your chances.

---

## 🚀 Live Demo
> Coming soon — deployment in progress

---

## 📸 Preview

> Upload your resume (PDF) → Paste a job description → Get instant AI analysis

**What you get:**
- ✅ Match Score (0–100%)
- ✅ Missing Keywords
- ✅ AI-generated Suggestions

---

## ⚙️ Features

- **PDF Resume Upload** — parses your actual resume content
- **AI Match Scoring** — compares resume vs job description intelligently
- **Missing Keywords Detection** — shows exactly what's absent
- **Improvement Suggestions** — actionable, specific feedback
- **Multi-API Fallback** — auto-switches between Groq → Gemini → OpenAI when rate limits hit
- **Analysis History** — every result saved to MongoDB
- **Responsive UI** — works on all screen sizes

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React.js (Vite) | UI framework |
| Axios | API calls |
| CSS3 | Styling |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| Multer | PDF file upload handling |
| pdf-parse | PDF text extraction |
| Groq SDK (LLaMA 3.1) | Primary AI model |
| Google Gemini API | Fallback AI model |
| OpenAI API | Secondary fallback AI model |

---

## 🔁 AI Fallback System

The app uses a 3-tier fallback to ensure uninterrupted service:

```
Request → Groq (LLaMA 3.1)
              ↓ fails / rate limit
         → Gemini 1.5 Flash
              ↓ fails / rate limit
         → OpenAI GPT-3.5
```

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   └── analyzeController.js   # Core AI logic + fallback
│   ├── models/
│   │   └── Analysis.js      # MongoDB schema
│   ├── routes/
│   │   └── analyzeRoutes.js
│   ├── .env                 # Environment variables (not pushed)
│   └── server.js
│
└── README.md
```

---

## 🔧 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- At least one API key: Groq / Gemini / OpenAI

### 1. Clone the repo
```bash
git clone https://github.com/abhinashp25/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Setup the server
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

Start the server:
```bash
node server.js
```

### 3. Setup the client
```bash
cd ../client
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload PDF + job description, get AI analysis |

**Request:** `multipart/form-data`
- `resume` — PDF file
- `jobDescription` — string

**Response:**
```json
{
  "success": true,
  "data": {
    "matchScore": 82,
    "missingKeywords": ["agile", "docker"],
    "suggestions": ["Add agile methodology experience..."]
  }
}
```

---

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Yes | Primary AI — [Get here](https://console.groq.com) |
| `GEMINI_API_KEY` | No | Fallback AI — [Get here](https://aistudio.google.com) |
| `OPENAI_API_KEY` | No | Fallback AI — [Get here](https://platform.openai.com) |

---

## 🗺️ Roadmap

- [ ] Firebase Google Auth integration
- [ ] User dashboard with analysis history
- [ ] Resume improvement suggestions with diff view
- [ ] Bulk resume screening for recruiters
- [ ] Deploy on Render

---

## 👨‍💻 Author

**Abhinash Pradhan**
- GitHub: [@abhinashp25](https://github.com/abhinashp25)
- LinkedIn: [linkedin.com/in/abhinash-pradhan](https://linkedin.com/in/abhinash-pradhan)

---

## 📄 License

MIT License — feel free to use and modify.