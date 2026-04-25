import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserStats } from "../api/userApi";
import { getUserSubmissions } from "../api/submissionApi";
import SubmissionTable from "../components/submissions/SubmissionTable";

function UserProfilePage() {
  const { userId } = useParams();
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const statsData = await getUserStats(userId);
        setStats(statsData);

        const submissionsData = await getUserSubmissions(userId);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">Loading profile...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-container">
        <div className="card">User not found</div>
      </div>
    );
  }

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
          {stats.username}
        </h1>
        <p style={{ color: "#6b7280" }}>{stats.full_name}</p>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>{stats.email}</p>
        <span
          className="badge badge-primary"
          style={{ marginTop: "12px", display: "inline-block" }}
        >
          {stats.role}
        </span>
      </div>

      <div className="grid three-column" style={{ marginBottom: "24px" }}>
        <div className="card">
          <h3 style={{ color: "#4f46e5", marginBottom: "8px" }}>Total Submissions</h3>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#6366f1" }}>
            {stats.total_submissions}
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: "#10b981", marginBottom: "8px" }}>Accepted</h3>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#059669" }}>
            {stats.accepted_submissions}
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: "#8b5cf6", marginBottom: "8px" }}>Acceptance Rate</h3>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#7c3aed" }}>
            {stats.acceptance_rate.toFixed(1)}%
          </p>
        </div>
      </div>

      <h2 style={{ marginBottom: "12px", color: "#374151" }}>Recent Submissions</h2>
      <SubmissionTable submissions={submissions.slice(0, 10)} />
    </div>
  );
}

export default UserProfilePage;
