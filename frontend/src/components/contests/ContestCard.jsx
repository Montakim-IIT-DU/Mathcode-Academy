import { Link } from "react-router-dom";
import useContestStatus from "../../hooks/useContestStatus";
import { getContestStatusBadgeClass } from "../../utils/contestStatus";

function ContestCard({ contest }) {
  const currentStatus = useContestStatus(contest);
  const badgeClass = getContestStatusBadgeClass(currentStatus);

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
          <span className={badgeClass}>{currentStatus}</span>
          <span className="badge badge-primary" style={{ marginLeft: "8px" }}>
            {contest.contest_type || "Online"}
          </span>
          <h3 style={{ marginTop: "12px", fontSize: "22px" }}>{contest.title}</h3>
        </div>

        <Link
          to={`/contests/${contest.id}`}
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            background: "#f5f3ff",
            color: "#7c3aed",
            fontWeight: "700"
          }}
        >
          Open
        </Link>
      </div>

      <p style={{ marginTop: "16px", color: "#4b5563", lineHeight: "1.7" }}>
        {contest.description}
      </p>

      <div style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px" }}>
        {contest.venue && <p>Venue: {contest.venue}</p>}
        <p style={{ marginTop: contest.venue ? "6px" : 0 }}>
          Problems: {contest.problems?.length || 0}
        </p>
        <p style={{ marginTop: "6px" }}>
          Participants: {contest.participant_count || 0}
        </p>
        <p style={{ marginTop: "6px" }}>Start: {contest.start_time}</p>
        <p style={{ marginTop: "6px" }}>End: {contest.end_time}</p>
      </div>
    </div>
  );
}

export default ContestCard;
