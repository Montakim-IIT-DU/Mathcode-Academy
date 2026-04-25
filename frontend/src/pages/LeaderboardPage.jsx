import { useEffect, useState } from "react";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { getLeaderboard } from "../api/leaderboardApi";

function LeaderboardPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setEntries(data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="page-container">
      <h1 className="section-title">Global Leaderboard</h1>
      <p className="section-subtitle">
        Track top performers by solved count and penalty.
      </p>
      <LeaderboardTable entries={entries} />
    </div>
  );
}

export default LeaderboardPage;