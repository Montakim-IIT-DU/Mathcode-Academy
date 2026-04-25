import { Link } from "react-router-dom";

function ProblemCard({ problem }) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "flex-start"
        }}
      >
        <div>
          <span className="badge badge-primary">{problem.code}</span>
          <h3 style={{ marginTop: "12px", fontSize: "22px" }}>{problem.title}</h3>
          <p style={{ marginTop: "8px", color: "#6b7280" }}>
            Difficulty: {problem.difficulty}
          </p>
        </div>

        <Link
          to={`/problems/${problem.id}`}
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            background: "#eef2ff",
            color: "#4f46e5",
            fontWeight: "700"
          }}
        >
          Solve
        </Link>
      </div>

      <p style={{ marginTop: "16px", color: "#4b5563", lineHeight: "1.7" }}>
        {problem.statement?.length > 140
          ? `${problem.statement.slice(0, 140)}...`
          : problem.statement}
      </p>
    </div>
  );
}

export default ProblemCard;