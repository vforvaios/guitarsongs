import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>

        <nav>{/* links */}</nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
