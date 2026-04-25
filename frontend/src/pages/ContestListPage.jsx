import { useEffect, useState } from "react";
import { getContests } from "../api/contestApi";

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
        {contests.map((contest) => (
          <div key={contest.id} className="card">
            <h3>{contest.title}</h3>
            <p style={{ marginTop: "8px" }}>{contest.description}</p>
            <p style={{ marginTop: "8px" }}>Status: {contest.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContestListPage;