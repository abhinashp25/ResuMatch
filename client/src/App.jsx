import { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      setError('Please upload a resume and enter a job description')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDescription', jobDesc)

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', formData)
      setResult(res.data.data)
    } catch (err) {
      setError('Analysis failed. Check if server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>AI Resume Analyzer</h1>
      <p className="subtitle">Upload your resume and paste a job description to get your match score</p>

      <div className="card">
        <label>Upload Resume (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="card">
        <label>Job Description</label>
        <textarea
          rows={8}
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <div className="score-box">
            <h2>Match Score</h2>
            <div className={`score ${result.matchScore >= 70 ? 'high' : result.matchScore >= 40 ? 'mid' : 'low'}`}>
              {result.matchScore}%
            </div>
          </div>

          <div className="section">
            <h3>Missing Keywords</h3>
            <div className="tags">
              {result.missingKeywords.map((kw, i) => (
                <span key={i} className="tag">{kw}</span>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}