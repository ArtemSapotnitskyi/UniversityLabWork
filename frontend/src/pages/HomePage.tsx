import { Link } from "react-router";

export default function HomePage() {
  return (
    <div style={{ marginTop: "10vh" }}>
      <h1 style={{ fontSize: "48px", color: "var(--accent)" }}>
        System AutoManager
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "var(--text-muted)",
          maxWidth: "600px",
          marginBottom: "40px",
        }}
      >
        Zarządzaj swoją flotą w nowoczesny sposób. Przeglądaj, dodawaj i
        konfiguruj parametry samochodów w panelu administracyjnym.
      </p>

      <Link
        to="/cars"
        className="btn"
        style={{ padding: "16px 32px", fontSize: "16px" }}
      >
        Przejdź do garażu
      </Link>
    </div>
  );
}
