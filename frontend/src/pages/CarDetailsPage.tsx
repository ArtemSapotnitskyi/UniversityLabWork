import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";

export default function CarDetailsPage() {
  const { id } = useParams();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Car ID not found.");
      setLoading(false);
      return;
    }

    async function loadCar() {
      try {
        const data = await getCarById(id!);
        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load car.");
      } finally {
        setLoading(false);
      }
    }

    loadCar();
  }, [id]);

  if (loading) return <p>Ładowanie danych pojazdu...</p>;

  if (error || !car) {
    return (
      <div>
        <p style={{ color: "var(--danger)" }}>{error || "Car not found."}</p>
        <Link to="/cars" className="btn btn-outline">
          Powrót do garażu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="details-hero">
        <h1>
          {car.brand} {car.model}
        </h1>
        <div className="details-id">ID Pojazdu: {car.id}</div>
      </div>

      <div className="specs-container">
        <div className="spec-badge">
          <span>Liczba drzwi</span>
          <strong>{car.doorsNumber}</strong>
        </div>
        <div className="spec-badge">
          <span>Bagażnik</span>
          <strong>{car.luggageCapacity} l</strong>
        </div>
        <div className="spec-badge">
          <span>Silnik</span>
          <strong>{car.engineCapacity} cm³</strong>
        </div>
        <div className="spec-badge">
          <span>Paliwo</span>
          <strong>{car.fuelType}</strong>
        </div>
        <div className="spec-badge">
          <span>Rocznik</span>
          <strong>{car.productionDate}</strong>
        </div>
        <div className="spec-badge">
          <span>Spalanie</span>
          <strong>{car.averageFuelConsumption} l/100 km</strong>
        </div>
        <div className="spec-badge">
          <span>Nadwozie</span>
          <strong>{car.bodyType}</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Link to={`/cars/${car.id}/edit`} className="btn">
          Edytuj ten pojazd
        </Link>
        <Link to="/cars" className="btn btn-outline">
          Powrót do garażu
        </Link>
      </div>
    </div>
  );
}
