import { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/adminApi";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="page-container">
      <h1 className="section-title">Admin Dashboard</h1>

      {!stats ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid two-column">
          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.total_users}</p>
          </div>
          <div className="card">
            <h3>Total Problems</h3>
            <p>{stats.total_problems}</p>
          </div>
          <div className="card">
            <h3>Total Contests</h3>
            <p>{stats.total_contests}</p>
          </div>
          <div className="card">
            <h3>Total Submissions</h3>
            <p>{stats.total_submissions}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;