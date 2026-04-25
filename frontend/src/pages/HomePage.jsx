import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          padding: "40px",
          background: "linear-gradient(135deg, #eef2ff, #fdf2f8)"
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "800",
            color: "#4338ca",
            marginBottom: "14px"
          }}
        >
          Welcome to Mathcode Academy
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: "#4b5563",
            maxWidth: "760px",
            lineHeight: "1.8"
          }}
        >
          Practice programming problems, join coding contests, submit solutions,
          and climb the leaderboard in a colorful Codeforces-inspired platform.
        </p>

        <div style={{ display: "flex", gap: "14px", marginTop: "24px", flexWrap: "wrap" }}>
          <Link
            to="/problems"
            style={{
              padding: "12px 20px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: "700"
            }}
          >
            Explore Problems
          </Link>

          <Link
            to="/contests"
            style={{
              padding: "12px 20px",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#4f46e5",
              fontWeight: "700",
              border: "1px solid #dbeafe"
            }}
          >
            View Contests
          </Link>
        </div>
      </div>

      <div className="grid three-column" style={{ marginTop: "24px" }}>
        <div className="card">
          <h3 style={{ color: "#4f46e5", marginBottom: "8px" }}>Solve Problems</h3>
          <p style={{ color: "#6b7280" }}>
            Practice easy, medium, and hard problems with a clean interface.
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: "#db2777", marginBottom: "8px" }}>Join Contests</h3>
          <p style={{ color: "#6b7280" }}>
            Participate in timed contests and compete with other users.
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: "#7c3aed", marginBottom: "8px" }}>Track Progress</h3>
          <p style={{ color: "#6b7280" }}>
            Follow submissions, verdicts, and rankings on the leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;