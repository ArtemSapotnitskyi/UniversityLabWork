import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
      <h1 style={{ fontSize: "64px", margin: "0", color: "var(--accent)" }}>
        404
      </h1>
      <p
        style={{
          fontSize: "20px",
          color: "var(--text-muted)",
          marginBottom: "30px",
        }}
      >
        System nie mógł odnaleźć żądanej strony.
      </p>
      <Link to="/" className="btn btn-outline">
        Wróć do Panelu Głównego
      </Link>
    </div>
  );
}
