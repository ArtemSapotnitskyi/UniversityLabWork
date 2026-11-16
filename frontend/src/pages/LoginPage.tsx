import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { login } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      navigate("/cars");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.response?.data || "Błąd logowania",
      );
    }
  };

  return (
    <div className="auth-wrapper" style={wrapperStyle}>
      <div className="auth-card" style={cardStyle}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Logowanie</h1>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Wprowadź swój email"
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
              placeholder="Wprowadź hasło"
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
            Zaloguj się
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", color: "#9ca3af" }}>
          Nie masz konta?{" "}
          <Link
            to="/register"
            style={{
              color: "#a855f7",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}

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
  backgroundColor: "#111827", // Дуже темний фон для інпуту
  color: "#f3f4f6",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: "14px",
  color: "#9ca3af",
  fontWeight: "500",
};

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
