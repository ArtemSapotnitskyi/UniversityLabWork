import { NavLink, Outlet, useNavigate } from "react-router";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const favoritesByUser = useCarUiStore((state) => state.favoritesByUser);
  const favoriteCount = user?.email
    ? (favoritesByUser[user.email] || []).length
    : 0;

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">AutoManager</div>

        <NavLink to="/" end>
          Dashboard
        </NavLink>

        {user ? (
          <>
            <NavLink to="/cars" end>
              Garage
            </NavLink>
            {user.role === "Admin" && (
              <NavLink to="/cars/new">Add Vehicle</NavLink>
            )}

            <div style={{ marginTop: "auto", padding: "12px 16px" }}>
              <span className="favorite-counter">
                Ulubione: {favoriteCount}
              </span>
              <div
                style={{
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  wordBreak: "break-all",
                }}
              >
                Zalogowany jako: <br /> <strong>{user.email}</strong> <br /> (
                {user.role})
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ marginTop: "12px", width: "100%" }}
              >
                Wyloguj
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "0 16px",
            }}
          >
            <NavLink to="/login" className="btn">
              Zaloguj się
            </NavLink>
            <NavLink to="/register" className="btn btn-outline">
              Zarejestruj się
            </NavLink>
          </div>
        )}
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
