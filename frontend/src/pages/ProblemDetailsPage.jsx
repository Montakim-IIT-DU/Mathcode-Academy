import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProblemById, getProblemHint } from "../api/problemApi";
import { getSampleTestcasesByProblem } from "../api/testcaseApi";
import Button from "../components/common/Button";
import CodeEditor from "../components/problems/CodeEditor";
import SubmitPanel from "../components/problems/SubmitPanel";

function ProblemDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contestId");
  const [problem, setProblem] = useState(null);
  const [sampleTestcases, setSampleTestcases] = useState([]);
  const [hintData, setHintData] = useState(null);
  const [hintMessage, setHintMessage] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [language, setLanguage] = useState("python");
  const [sourceCode, setSourceCode] = useState(`# Write your solution here\n`);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);

        try {
          const samples = await getSampleTestcasesByProblem(id);
          setSampleTestcases(samples);
        } catch (error) {
          console.error("Failed to load sample testcases", error);
          setSampleTestcases([]);
        }
      } catch (error) {
        console.error("Failed to load problem", error);
      }
    };

    setHintData(null);
    setHintMessage("");
    fetchProblem();
  }, [id]);

  const handleLoadHints = async () => {
    try {
      setHintLoading(true);
      setHintMessage("");
      const data = await getProblemHint(problem.id);
      setHintData(data);
    } catch (error) {
      console.error("Failed to load hints", error);
      setHintMessage(error?.response?.data?.detail || "Failed to load hints");
    } finally {
      setHintLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className="page-container">
        <div className="card">Loading problem...</div>
      </div>
    );
  }

  const tags = Array.isArray(problem.tags)
    ? problem.tags
    : String(problem.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

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
          <span className="badge badge-primary">Topic: {problem.topic || "General"}</span>
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

          <div style={{ marginTop: "22px" }}>
            <h3 style={{ marginBottom: "12px", color: "#8b5cf6" }}>Sample Test Cases</h3>

            {sampleTestcases.length > 0 ? (
              <div className="grid">
                {sampleTestcases.map((testcase, index) => (
                  <div
                    key={testcase.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      background: "#f8faff",
                      padding: "16px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px"
                      }}
                    >
                      <strong style={{ color: "#4338ca" }}>Sample {index + 1}</strong>
                      <span className="badge badge-success">Admin marked</span>
                    </div>

                    <div className="grid" style={{ gap: "12px" }}>
                      <div>
                        <strong style={{ display: "block", marginBottom: "6px" }}>Input</strong>
                        <pre
                          style={{
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            padding: "12px",
                            borderRadius: "12px",
                            background: "#111827",
                            color: "#f9fafb"
                          }}
                        >
                          {testcase.input_data}
                        </pre>
                      </div>

                      <div>
                        <strong style={{ display: "block", marginBottom: "6px" }}>
                          Expected Output
                        </strong>
                        <pre
                          style={{
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            padding: "12px",
                            borderRadius: "12px",
                            background: "#eef2ff",
                            color: "#312e81"
                          }}
                        >
                          {testcase.expected_output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6b7280" }}>No sample test cases are available yet.</p>
            )}
          </div>

          {tags.length > 0 && (
            <div style={{ marginTop: "18px" }}>
              <h3 style={{ marginBottom: "10px", color: "#8b5cf6" }}>Tags</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {tags.map((tag, index) => (
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
            contestId={contestId}
          />

          <div className="card">
            <h3 style={{ color: "#8b5cf6", marginBottom: "12px" }}>AI Hints</h3>
            <Button onClick={handleLoadHints} disabled={hintLoading} style={{ width: "100%" }}>
              {hintLoading ? "Loading Hints..." : "Get Hints"}
            </Button>

            {hintMessage && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: "600"
                }}
              >
                {hintMessage}
              </div>
            )}

            {hintData?.hints?.length > 0 && (
              <ol
                style={{
                  marginTop: "16px",
                  paddingLeft: "20px",
                  color: "#374151",
                  lineHeight: "1.7"
                }}
              >
                {hintData.hints.map((hint, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    {hint}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailsPage;
