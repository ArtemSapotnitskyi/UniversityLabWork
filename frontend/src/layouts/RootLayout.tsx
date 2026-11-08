import { NavLink, Outlet } from "react-router";
import { useCarUiStore } from "../store/useCarUiStore";

export default function RootLayout() {
  const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);

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

        <div style={{ marginTop: "auto", padding: "12px 16px" }}>
          <span className="favorite-counter">Ulubione: {favoriteCount}</span>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
