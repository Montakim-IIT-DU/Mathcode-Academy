import VerdictBadge from "./VerdictBadge";

function SubmissionTable({ submissions = [] }) {
  if (!submissions.length) {
    return (
      <div className="card empty-state">
        <p>No submissions found yet.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Submission ID</th>
            <th style={thStyle}>Problem ID</th>
            <th style={thStyle}>Language</th>
            <th style={thStyle}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={submission.id ?? index}
              style={{
                transition: "all 0.2s ease"
              }}
            >
              <td style={tdStyle}>#{submission.id}</td>
              <td style={tdStyle}>{submission.problem_id}</td>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#6366f1" }}>
                {submission.language}
              </td>
              <td style={tdStyle}>
                <VerdictBadge verdict={submission.verdict} />
              </td>
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

export default SubmissionTable;