import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserPerformance, getUserStats } from "../api/userApi";
import { getUserSubmissions } from "../api/submissionApi";
import SubmissionTable from "../components/submissions/SubmissionTable";
import PerformanceGraph from "../components/users/PerformanceGraph";

function UserProfilePage() {
  const { userId } = useParams();
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const statsData = await getUserStats(userId);
        setStats(statsData);

        const submissionsData = await getUserSubmissions(userId);
        setSubmissions(submissionsData);

        try {
          const performanceData = await getUserPerformance(userId);
          setPerformance(performanceData);
        } catch (error) {
          console.error("Failed to load performance, using submissions fallback", error);
          setPerformance(buildPerformanceFromSubmissions(statsData, submissionsData));
        }
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

      <div className="grid three-column" style={{ marginBottom: "24px" }}>
        <div className="card">
          <h3 style={{ color: "#4f46e5", marginBottom: "8px" }}>Total Solved</h3>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#6366f1" }}>
            {performance?.total_solved || 0}
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: "#10b981", marginBottom: "8px" }}>Practice Solves</h3>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#059669" }}>
            {performance?.practice_solved || 0}
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: "#8b5cf6", marginBottom: "8px" }}>Contest Solves</h3>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#7c3aed" }}>
            {performance?.contest_solved || 0}
          </p>
        </div>
      </div>

      <PerformanceGraph performance={performance} />

      <h2 style={{ marginBottom: "12px", color: "#374151" }}>Recent Submissions</h2>
      <SubmissionTable submissions={submissions.slice(0, 10)} />
    </div>
  );
}

function buildPerformanceFromSubmissions(stats, submissions) {
  const acceptedSubmissions = submissions.filter(
    (submission) => submission.verdict === "Accepted"
  );
  const dateTotals = {};
  let practiceSolved = 0;
  let contestSolved = 0;

  const graph = acceptedSubmissions.map((submission, index) => {
    const solveDate = getSubmissionDate(submission);
    dateTotals[solveDate] = (dateTotals[solveDate] || 0) + 1;

    if (submission.contest_id) {
      contestSolved += 1;
    } else {
      practiceSolved += 1;
    }

    return {
      submission_id: submission.id,
      problem_id: submission.problem_id,
      problem_title: `Problem #${submission.problem_id}`,
      contest_id: submission.contest_id,
      contest_title: null,
      source: submission.contest_id ? "Contest" : "Practice Problem",
      solve_date: solveDate,
      solved_count: index + 1
    };
  });

  let cumulativeSolved = 0;
  const dateSummary = Object.keys(dateTotals)
    .sort()
    .map((date) => {
      cumulativeSolved += dateTotals[date];
      return {
        date,
        solved: dateTotals[date],
        cumulative_solved: cumulativeSolved
      };
    });

  return {
    user_id: stats.id,
    username: stats.username,
    total_solved: acceptedSubmissions.length,
    practice_solved: practiceSolved,
    contest_solved: contestSolved,
    onsite_solved: 0,
    accepted_submissions: acceptedSubmissions.length,
    graph,
    date_summary: dateSummary
  };
}

function getSubmissionDate(submission) {
  if (submission.created_at) {
    return String(submission.created_at).slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

export default UserProfilePage;
