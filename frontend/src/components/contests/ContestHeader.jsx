import ContestTimer from "./ContestTimer";

function ContestHeader({ contest }) {
  if (!contest) return null;

  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(135deg, #eef2ff, #fdf2f8)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", color: "#4338ca", marginBottom: "10px" }}>
            {contest.title}
          </h1>
          <p style={{ color: "#4b5563", lineHeight: "1.8", maxWidth: "720px" }}>
            {contest.description}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            <span className="badge badge-primary">{contest.contest_type || "Online"}</span>
            {contest.venue && <span className="badge badge-warning">{contest.venue}</span>}
            <span className="badge badge-success">
              {contest.participant_count || 0} participants
            </span>
          </div>
        </div>

        <div style={{ minWidth: "220px" }}>
          <ContestTimer targetTime={contest.end_time} />
        </div>
      </div>
    </div>
  );
}

export default ContestHeader;
