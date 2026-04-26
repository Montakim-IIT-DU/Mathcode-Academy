import { useEffect, useState } from "react";
import { getContests } from "../api/contestApi";
import ContestCard from "../components/contests/ContestCard";

function ContestListPage() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await getContests();
        setContests(data);
      } catch (error) {
        console.error("Failed to load contests", error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="page-container">
      <h1 className="section-title">Contests</h1>

      <div className="grid">
        {contests.length === 0 ? (
          <div className="card empty-state">No contests available yet.</div>
        ) : (
          contests.map((contest) => <ContestCard key={contest.id} contest={contest} />)
        )}
      </div>
    </div>
  );
}

export default ContestListPage;
