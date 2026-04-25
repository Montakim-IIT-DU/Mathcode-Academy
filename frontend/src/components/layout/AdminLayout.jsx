import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="page-container">
      <h1 className="section-title">Admin Panel</h1>
      <Outlet />
    </div>
  );
}

export default AdminLayout;