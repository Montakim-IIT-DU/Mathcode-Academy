import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getContestById, joinContest } from "../api/contestApi";
import ContestHeader from "../components/contests/ContestHeader";
import Button from "../components/common/Button";

function ContestDetailsPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [message, setMessage] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const data = await getContestById(id);
        setContest(data);
      } catch (error) {
        console.error("Failed to load contest", error);
      }
    };

    fetchContest();
  }, [id]);

  const handleJoin = async () => {
    try {
      const data = await joinContest(id);
      setMessage(data.message);
      setHasJoined(true);
    } catch (error) {
      setMessage("Failed to join contest");
    }
  };

  if (!contest) {
    return (
      <div className="page-container">
        <div className="card">Loading contest...</div>
      </div>
    );
  }

  const getStatusBadgeStyle = () => {
    switch (contest.status) {
      case "Running":
        return { background: "#dcfce7", color: "#15803d" };
      case "Finished":
        return { background: "#fee2e2", color: "#dc2626" };
      case "Upcoming":
        return { background: "#fef3c7", color: "#d97706" };
      default:
        return { background: "#e5e7eb", color: "#4b5563" };
    }
  };

  const statusStyle = getStatusBadgeStyle();

  return (
    <div className="page-container">
      <ContestHeader contest={contest} />

      <div className="grid two-column" style={{ marginTop: "20px" }}>
        <div className="card">
          <h3 style={{ color: "#6366f1", marginBottom: "12px" }}>Contest Details</h3>
          <p><strong>Status:</strong>
            <span
              style={{
                marginLeft: "8px",
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "700",
                background: statusStyle.background,
                color: statusStyle.color
              }}
            >
              {contest.status}
            </span>
          </p>
          <p style={{ marginTop: "10px" }}><strong>Start Time:</strong> {contest.start_time}</p>
          <p style={{ marginTop: "10px" }}><strong>End Time:</strong> {contest.end_time}</p>
          
          <div style={{ marginTop: "16px" }}>
            <Link
              to={`/contests/${id}/standings`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "999px",
                background: "#f0f4ff",
                color: "#4f46e5",
                fontWeight: "700",
                textDecoration: "none",
                marginTop: "8px"
              }}
            >
              View Standings
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: "#8b5cf6", marginBottom: "12px" }}>Join This Contest</h3>
          <p style={{ color: "#4b5563", lineHeight: "1.8", marginBottom: "16px" }}>
            Enter the contest, solve problems, and improve your ranking on the leaderboard.
          </p>

          <Button onClick={handleJoin} disabled={hasJoined}>
            {hasJoined ? "Already Joined ✓" : "Join Contest"}
          </Button>

          {message && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "#ecfdf5",
                color: "#047857",
                fontWeight: "600"
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContestDetailsPage;