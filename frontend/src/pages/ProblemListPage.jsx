import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../api/problemApi";

function ProblemListPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((p) =>
    filter === "All" ? true : p.difficulty === filter
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "#dcfce7", color: "#15803d" };
      case "Medium":
        return { bg: "#fef3c7", color: "#d97706" };
      case "Hard":
        return { bg: "#fee2e2", color: "#dc2626" };
      default:
        return { bg: "#e5e7eb", color: "#4b5563" };
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="section-title">Problems</h1>
        <div className="card">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
        <h1 className="section-title" style={{ margin: 0 }}>
          Problems ({filteredProblems.length})
        </h1>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setFilter(difficulty)}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid #dbe2f0",
                background: filter === difficulty ? "#4f46e5" : "#fff",
                color: filter === difficulty ? "#fff" : "#374151",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Difficulty</th>
              <th style={thStyle}>Time Limit</th>
              <th style={thStyle}>Memory Limit</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem, index) => {
              const diffColor = getDifficultyColor(problem.difficulty);
              return (
                <tr key={problem.id} style={{ transition: "all 0.2s ease" }}>
                  <td style={tdStyle}>{problem.code}</td>
                  <td style={{ ...tdStyle, fontWeight: "600", color: "#4338ca" }}>
                    {problem.title}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "700",
                        background: diffColor.bg,
                        color: diffColor.color
                      }}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td style={tdStyle}>{problem.time_limit}s</td>
                  <td style={tdStyle}>{problem.memory_limit}MB</td>
                  <td style={tdStyle}>
                    <Link
                      to={`/problems/${problem.id}`}
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "#eef2ff",
                        color: "#4f46e5",
                        fontWeight: "700",
                        fontSize: "12px",
                        textDecoration: "none"
                      }}
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 12px",
  borderBottom: "2px solid #e5e7eb",
  color: "#4f46e5",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase"
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #f3f4f6"
};

export default ProblemListPage;