import { Link } from "react-router-dom";

function getRankDisplay(rank) {
  if (rank === 1) return "🥇 1";
  if (rank === 2) return "🥈 2";
  if (rank === 3) return "🥉 3";
  return rank;
}

function LeaderboardTable({ entries = [] }) {
  if (!entries.length) {
    return (
      <div className="card empty-state">
        <p>No leaderboard data available yet.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Solved</th>
            <th style={thStyle}>Penalty</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id ?? index}
              style={{
                background:
                  entry.rank === 1
                    ? "#fff7ed"
                    : entry.rank === 2
                    ? "#f8fafc"
                    : entry.rank === 3
                    ? "#fdf2f8"
                    : "transparent"
              }}
            >
              <td style={tdStyle}>{getRankDisplay(entry.rank)}</td>
              <td style={{ ...tdStyle, fontWeight: "700", color: "#4338ca" }}>
                <Link
                  to={`/profile/${entry.user_id}`}
                  style={{ textDecoration: "none", color: "#4338ca", cursor: "pointer" }}
                >
                  {entry.username}
                </Link>
              </td>
              <td style={tdStyle}>{entry.solved}</td>
              <td style={tdStyle}>{entry.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 12px",
  borderBottom: "1px solid #e5e7eb",
  color: "#4f46e5",
  fontSize: "14px"
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #f3f4f6"
};

export default LeaderboardTable;