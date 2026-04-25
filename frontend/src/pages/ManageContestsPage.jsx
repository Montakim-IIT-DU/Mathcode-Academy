import { useEffect, useState } from "react";
import { getContests } from "../api/contestApi";
import ContestForm from "../components/admin/ContestForm";
import ContestCard from "../components/contests/ContestCard";

function ManageContestsPage() {
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
      <h1 className="section-title">Manage Contests</h1>
      <p className="section-subtitle">
        Create contests and review all available contest cards here.
      </p>

      <div className="grid two-column">
        <ContestForm />

        <div className="grid">
          {contests.length === 0 ? (
            <div className="card empty-state">
              <p>No contests available yet.</p>
            </div>
          ) : (
            contests.map((contest) => <ContestCard key={contest.id} contest={contest} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageContestsPage;