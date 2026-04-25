import { Link } from "react-router-dom";
import { getUser, clearAuthStorage } from "../../utils/storage";

function Navbar() {
  const user = getUser();

  const handleLogout = () => {
    clearAuthStorage();
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap"
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#4f46e5",
            letterSpacing: "0.3px"
          }}
        >
          Mathcode Academy
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#374151",
            fontWeight: "600",
            flexWrap: "wrap"
          }}
        >
          <Link to="/problems">Problems</Link>
          <Link to="/contests">Contests</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/submissions">Submissions</Link>

          {user && user.role === "admin" && (
            <>
              <span style={{ color: "#dbeafe" }}>|</span>
              <Link to="/admin" style={{ color: "#7c3aed", fontWeight: "700" }}>
                Admin
              </Link>
              <Link to="/admin/problems" style={{ color: "#7c3aed" }}>
                Manage Problems
              </Link>
              <Link to="/admin/contests" style={{ color: "#7c3aed" }}>
                Manage Contests
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                style={{
                  padding: "10px 16px",
                  borderRadius: "999px",
                  background: "#eef2ff",
                  color: "#4f46e5"
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "10px 16px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff"
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "#fdf2f8",
                  color: "#db2777",
                  fontSize: "14px"
                }}
              >
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "999px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;