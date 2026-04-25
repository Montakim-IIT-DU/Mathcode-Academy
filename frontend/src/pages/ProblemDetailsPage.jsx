import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../api/problemApi";
import CodeEditor from "../components/problems/CodeEditor";
import SubmitPanel from "../components/problems/SubmitPanel";

function ProblemDetailsPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [sourceCode, setSourceCode] = useState(`# Write your solution here\n`);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
      } catch (error) {
        console.error("Failed to load problem", error);
      }
    };

    fetchProblem();
  }, [id]);

  if (!problem) {
    return (
      <div className="page-container">
        <div className="card">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
          marginBottom: "20px"
        }}
      >
        <span className="badge badge-primary">{problem.code}</span>
        <h1
          style={{
            marginTop: "14px",
            fontSize: "34px",
            color: "#4338ca"
          }}
        >
          {problem.title}
        </h1>

        <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span className="badge badge-warning">{problem.difficulty}</span>
          <span className="badge badge-primary">Time Limit: {problem.time_limit}s</span>
          <span className="badge badge-primary">Memory: {problem.memory_limit}MB</span>
        </div>
      </div>

      <div className="grid two-column">
        <div className="card">
          <h2 style={{ marginBottom: "14px", color: "#6366f1" }}>Problem Statement</h2>
          <p style={{ lineHeight: "1.9", color: "#374151", whiteSpace: "pre-wrap" }}>
            {problem.statement}
          </p>

          {problem.tags && (
            <div style={{ marginTop: "18px" }}>
              <h3 style={{ marginBottom: "10px", color: "#8b5cf6" }}>Tags</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {String(problem.tags)
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag, index) => (
                    <span key={index} className="badge badge-primary">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid">
          <CodeEditor value={sourceCode} onChange={setSourceCode} language={language} />
          <SubmitPanel
            problemId={problem.id}
            sourceCode={sourceCode}
            setSourceCode={setSourceCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailsPage;