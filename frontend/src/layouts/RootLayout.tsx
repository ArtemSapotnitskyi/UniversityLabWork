import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">AutoManager</div>

        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/cars" end>
          Garage
        </NavLink>

        <NavLink to="/cars/new">Add Vehicle</NavLink>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
