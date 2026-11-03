import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Car } from "../models/Car";
import { getCars, deleteCar } from "../services/carService";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCars() {
      try {
        const data = await getCars();
        setCars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cars.");
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Czy na pewno chcesz usunąć ten samochód?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCar(id);
      setCars(cars.filter((car) => car.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete car.");
    }
  }

  const filteredCars = cars.filter((car) =>
    `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <p>Ładowanie garażu...</p>;
  if (error) return <p style={{ color: "var(--danger)" }}>Błąd: {error}</p>;

  return (
    <div>
      <h1>Twój Garaż</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Szukaj według marki lub modelu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {cars.length === 0 ? (
        <p>Brak samochodów w bazie.</p>
      ) : filteredCars.length === 0 ? (
        <p>Nie znaleziono samochodów o takich parametrach.</p>
      ) : (
        <div className="car-grid">
          {filteredCars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-card-title">
                {car.brand} {car.model}
              </div>

              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Rok: {car.productionDate} <br />
                Paliwo: {car.fuelType}
              </div>

              <div className="car-card-actions">
                <Link to={`/cars/${car.id}`} className="btn">
                  Szczegóły
                </Link>
                <Link to={`/cars/${car.id}/edit`} className="btn btn-outline">
                  Edytuj
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(car.id)}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
