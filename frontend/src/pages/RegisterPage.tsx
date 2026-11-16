import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../services/authService";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await register(userName, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd rejestracji");
    }
  };

  return (
    <div className="auth-wrapper" style={wrapperStyle}>
      <div className="auth-card" style={cardStyle}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
          Rejestracja
        </h1>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>Nazwa użytkownika</label>
            <input
              type="text"
              placeholder="Jak się nazywasz?"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Twój adres email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>Hasło</label>
            <input
              type="password"
              placeholder="Wymyśl silne hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{ marginTop: "8px", width: "100%", padding: "12px" }}
          >
            Załóż konto
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", color: "#9ca3af" }}>
          Masz już konto?{" "}
          <Link
            to="/login"
            style={{
              color: "#a855f7",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}

// Ті ж стилі, що і в логуванні
const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  padding: "20px",
};
const cardStyle = {
  backgroundColor: "#1f2937",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
  width: "100%",
  maxWidth: "420px",
  color: "#f3f4f6",
};
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "#f3f4f6",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box" as const,
};
const labelStyle = { fontSize: "14px", color: "#9ca3af", fontWeight: "500" };
const errorBannerStyle = {
  backgroundColor: "rgba(220, 53, 69, 0.1)",
  color: "#fc8181",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid rgba(220, 53, 69, 0.3)",
  marginBottom: "16px",
  fontSize: "14px",
  textAlign: "center" as const,
};
