import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getContestById, joinContest } from "../api/contestApi";
import Button from "../components/common/Button";
import ContestHeader from "../components/contests/ContestHeader";
import useContestStatus from "../hooks/useContestStatus";
import { getContestStatusStyle } from "../utils/contestStatus";
import { getUser } from "../utils/storage";

function ContestDetailsPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [message, setMessage] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const currentStatus = useContestStatus(contest);

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
    const user = getUser();

    if (!user?.id) {
      setMessage("Please log in before joining the contest.");
      return;
    }

    try {
      const data = await joinContest(id, user.id);
      setMessage(data.message);
      setHasJoined(true);
      setContest((prev) =>
        prev
          ? {
              ...prev,
              participant_count: data.participant_count ?? prev.participant_count
            }
          : prev
      );
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to join contest");
    }
  };

  if (!contest) {
    return (
      <div className="page-container">
        <div className="card">Loading contest...</div>
      </div>
    );
  }

  const displayContest = { ...contest, status: currentStatus };
  const statusStyle = getContestStatusStyle(currentStatus);
  const canJoinContest = currentStatus === "Running";
  const joinButtonText = hasJoined
    ? "Already Joined"
    : canJoinContest
    ? "Join Contest"
    : currentStatus === "Upcoming"
    ? "Join Opens When Contest Starts"
    : "Contest Finished";
  const joinMessage =
    currentStatus === "Upcoming"
      ? "You can join only after the contest start time."
      : currentStatus === "Finished"
      ? "This contest has already finished."
      : "Enter the contest, solve problems, and improve your ranking on the leaderboard.";

  return (
    <div className="page-container">
      <ContestHeader contest={displayContest} />

      <div className="grid two-column" style={{ marginTop: "20px" }}>
        <div className="card">
          <h3 style={{ color: "#6366f1", marginBottom: "12px" }}>Contest Details</h3>
          <p>
            <strong>Status:</strong>
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
              {currentStatus}
            </span>
          </p>
          <p style={{ marginTop: "10px" }}>
            <strong>Type:</strong> {contest.contest_type || "Online"}
          </p>
          {contest.venue && (
            <p style={{ marginTop: "10px" }}>
              <strong>Venue:</strong> {contest.venue}
            </p>
          )}
          <p style={{ marginTop: "10px" }}>
            <strong>Participants:</strong> {contest.participant_count || 0}
          </p>
          <p style={{ marginTop: "10px" }}>
            <strong>Start Time:</strong> {contest.start_time}
          </p>
          <p style={{ marginTop: "10px" }}>
            <strong>End Time:</strong> {contest.end_time}
          </p>

          <div style={{ marginTop: "16px" }}>
            <Link
              to={`/contests/${id}/standings`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "6px",
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
            {joinMessage}
          </p>

          <Button onClick={handleJoin} disabled={hasJoined || !canJoinContest}>
            {joinButtonText}
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

      <div className="card" style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#4f46e5", marginBottom: "14px" }}>Contest Problems</h3>

        {!contest.problems || contest.problems.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No problems have been added yet.</p>
        ) : (
          <div className="grid">
            {contest.problems.map((problem) => (
              <div
                key={problem.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "14px",
                  alignItems: "center",
                  padding: "14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  background: "#ffffff",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <span className="badge badge-primary">{problem.code}</span>
                  <span className="badge badge-warning" style={{ marginLeft: "8px" }}>
                    {problem.difficulty}
                  </span>
                  <h4 style={{ marginTop: "10px", color: "#1f2937" }}>{problem.title}</h4>
                  <p style={{ marginTop: "6px", color: "#6b7280", fontSize: "14px" }}>
                    {problem.topic || "General"}
                  </p>
                </div>

                <Link
                  to={`/problems/${problem.id}?contestId=${contest.id}`}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    background: "#eef2ff",
                    color: "#4f46e5",
                    fontWeight: "700"
                  }}
                >
                  Solve
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestDetailsPage;
