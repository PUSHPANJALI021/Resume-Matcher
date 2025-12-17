import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(null);

  // ✅ UPLOAD RESUME
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setResult(null);
    setMatchScore(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Backend connection failed");
    }

    setLoading(false);
  };

  // ✅ MATCH RESUME
  const handleMatch = async () => {
    if (!result || !jobDescription) {
      alert("Upload resume and enter job description");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/match/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: result.text_preview, // ✅ correct
          job_description: jobDescription,
        }),
      });

      const data = await response.json();
      setMatchScore(data.match_percentage);
    } catch (err) {
      alert("Match API failed");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📄 Intelligent Resume Matching Platform</h1>

      <div style={styles.card}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button style={styles.button} onClick={handleUpload}>
          Upload Resume
        </button>

        {loading && <p>Uploading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {result && (
        <div style={styles.card}>
          <h2>Extracted Resume Data</h2>
          <p><b>Email:</b> {result.email}</p>
          <p><b>Phone:</b> {result.phone}</p>

          <p><b>Skills:</b></p>
          <div style={styles.skills}>
            {result.skills.map((skill, i) => (
              <span key={i} style={styles.skill}>{skill}</span>
            ))}
          </div>

          <h3>Job Description</h3>
          <textarea
            rows="6"
            style={styles.textarea}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <br /><br />
          <button style={styles.button} onClick={handleMatch}>
            Match Resume
          </button>

          {matchScore !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>Match Score: {matchScore}%</h3>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progress,
                    width: `${matchScore}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh",
    padding: "40px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    margin: "20px auto",
    width: "80%",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skill: {
    background: "#e0e7ff",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  progressBar: {
    height: "20px",
    background: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    background: "#28a745",
  },
};

export default App;
