import { useEffect, useState } from "react";
import { getProblems } from "../api/problemApi";
import ProblemForm from "../components/admin/ProblemForm";
import ProblemCard from "../components/problems/ProblemCard";

function ManageProblemsPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="page-container">
      <h1 className="section-title">Manage Problems</h1>
      <p className="section-subtitle">
        Create new problems and review existing ones in a single place.
      </p>

      <div className="grid two-column">
        <ProblemForm />

        <div className="grid">
          {problems.length === 0 ? (
            <div className="card empty-state">
              <p>No problems available yet.</p>
            </div>
          ) : (
            problems.map((problem) => <ProblemCard key={problem.id} problem={problem} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageProblemsPage;