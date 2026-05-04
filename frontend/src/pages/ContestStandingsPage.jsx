import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContestById } from "../api/contestApi";
import { getContestLeaderboard } from "../api/leaderboardApi";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import useContestStatus from "../hooks/useContestStatus";
import { getContestStatusStyle } from "../utils/contestStatus";

function ContestStandingsPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentStatus = useContestStatus(contest);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const contestData = await getContestById(id);
        setContest(contestData);

        const standingsData = await getContestLeaderboard(id);
        setStandings(standingsData);
      } catch (error) {
        console.error("Failed to load contest standings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContestData();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">Loading standings...</div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="page-container">
        <div className="card">Contest not found</div>
      </div>
    );
  }

  const statusStyle = getContestStatusStyle(currentStatus);

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ fontSize: "32px", color: "#4338ca", marginBottom: "12px" }}>
          {contest.title} - Standings
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "12px" }}>{contest.description}</p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <strong style={{ color: "#374151" }}>Status:</strong>
            <span
              className="badge"
              style={{
                marginLeft: "8px",
                background: statusStyle.background,
                color: statusStyle.color
              }}
            >
              {currentStatus}
            </span>
          </div>
          <div>
            <strong style={{ color: "#374151" }}>Start:</strong>
            <span style={{ marginLeft: "8px", color: "#6b7280" }}>{contest.start_time}</span>
          </div>
          <div>
            <strong style={{ color: "#374151" }}>End:</strong>
            <span style={{ marginLeft: "8px", color: "#6b7280" }}>{contest.end_time}</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: "12px", color: "#374151" }}>Final Standings</h2>
      <LeaderboardTable entries={standings} />
    </div>
  );
}

export default ContestStandingsPage;
