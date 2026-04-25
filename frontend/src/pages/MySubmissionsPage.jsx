import { useEffect, useState } from "react";
import { getUserSubmissions } from "../api/submissionApi";
import { getUser } from "../utils/storage";
import SubmissionTable from "../components/submissions/SubmissionTable";

function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const user = getUser();
        if (!user) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        const data = await getUserSubmissions(user.id);
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to load submissions", error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="section-title">My Submissions</h1>
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="section-title">My Submissions</h1>
      <p className="section-subtitle">
        Review your submitted solutions and current verdicts.
      </p>
      <SubmissionTable submissions={submissions} />
    </div>
  );
}

export default MySubmissionsPage;