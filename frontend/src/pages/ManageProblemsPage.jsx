import { useEffect, useState } from "react";
import { getProblems } from "../api/problemApi";
import ProblemEditor from "../components/admin/ProblemEditor";
import ProblemForm from "../components/admin/ProblemForm";

function ManageProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const fetchProblems = async () => {
    try {
      const data = await getProblems();
      setProblems(data);
    } catch (error) {
      console.error("Failed to load problems", error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleProblemCreated = (problem) => {
    setProblems((prev) => [problem, ...prev]);
  };

  const handleProblemSaved = (problem) => {
    setProblems((prev) =>
      prev.map((item) => (item.id === problem.id ? problem : item))
    );
    setSelectedProblem(problem);
  };

  const handleProblemDeleted = (problemId) => {
    setProblems((prev) => prev.filter((problem) => problem.id !== problemId));
    setSelectedProblem(null);
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Manage Problems</h1>
      <p className="section-subtitle">
        Create new problems and review existing ones in a single place.
      </p>

      <div className="grid two-column">
        {selectedProblem ? (
          <ProblemEditor
            problem={selectedProblem}
            onCancel={() => setSelectedProblem(null)}
            onDeleted={handleProblemDeleted}
            onSaved={handleProblemSaved}
          />
        ) : (
          <ProblemForm onCreated={handleProblemCreated} />
        )}

        <div className="grid">
          {problems.length === 0 ? (
            <div className="card empty-state">
              <p>No problems available yet.</p>
            </div>
          ) : (
            problems.map((problem) => (
              <div
                key={problem.id}
                className="card"
                style={{
                  border:
                    selectedProblem?.id === problem.id
                      ? "1px solid #8b5cf6"
                      : "1px solid rgba(229, 231, 235, 0.8)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    alignItems: "flex-start",
                    flexWrap: "wrap"
                  }}
                >
                  <div>
                    <span className="badge badge-primary">{problem.code}</span>
                    <span className="badge badge-warning" style={{ marginLeft: "8px" }}>
                      {problem.difficulty}
                    </span>
                    <h3 style={{ marginTop: "12px", fontSize: "22px" }}>
                      {problem.title}
                    </h3>
                    <p style={{ marginTop: "8px", color: "#6b7280" }}>
                      Topic: {problem.topic || "General"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProblem(problem)}
                    style={{
                      border: "1px solid #c7d2fe",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      background: "#eef2ff",
                      color: "#4f46e5",
                      fontWeight: "700"
                    }}
                  >
                    Edit
                  </button>
                </div>

                <p style={{ marginTop: "16px", color: "#4b5563", lineHeight: "1.7" }}>
                  {problem.statement?.length > 140
                    ? `${problem.statement.slice(0, 140)}...`
                    : problem.statement}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageProblemsPage;
