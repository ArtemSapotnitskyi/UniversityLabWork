import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { confirmEmail } from "../services/authService";

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    if (!userId || !token) {
      setStatus("error");
      setMessage("Nieprawidłowy lub brakujący link weryfikacyjny.");
      return;
    }

    confirmEmail(userId, token)
      .then(() => {
        setStatus("success");
        setMessage("Konto zostało aktywowane! Możesz się teraz zalogować.");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            err.response?.data ||
            "Link weryfikacyjny wygasł lub jest nieprawidłowy.",
        );
      });
  }, [searchParams]);

  return (
    <div className="auth-wrapper" style={wrapperStyle}>
      <div className="auth-card" style={cardStyle}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
          Weryfikacja e-mail
        </h1>

        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#9ca3af", fontSize: "18px" }}>
              Trwa sprawdzanie linku...
            </p>
          </div>
        )}

        {status === "success" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px" }}>✅</div>
            <p
              style={{ color: "#4ade80", fontSize: "18px", fontWeight: "500" }}
            >
              {message}
            </p>
            <Link
              to="/login"
              className="btn"
              style={{ width: "100%", padding: "12px", textAlign: "center" }}
            >
              Przejdź do logowania
            </Link>
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px" }}>❌</div>
            <p style={{ color: "#fc8181", fontSize: "16px" }}>{message}</p>
            <Link
              to="/login"
              className="btn btn-outline"
              style={{ width: "100%", padding: "12px", textAlign: "center" }}
            >
              Wróć do logowania
            </Link>
          </div>
        )}
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
