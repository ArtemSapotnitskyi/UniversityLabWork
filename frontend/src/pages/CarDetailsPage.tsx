import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import { useCarUiStore } from "../store/useCarUiStore";

export default function CarDetailsPage() {
  const { id } = useParams();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");

  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (!id) {
      setError("Car ID not found.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadCar() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCarById(id!, controller.signal);
        setCar(data);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Wystąpił nieznany błąd.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCar();

    return () => {
      controller.abort();
    };
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

  const isFavorite = favoriteCarIds.includes(car.id);

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
        <button
          type="button"
          className={
            isFavorite
              ? "btn favorite-button active-favorite"
              : "btn favorite-button"
          }
          onClick={() => toggleFavorite(car.id)}
        >
          {isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        </button>
        <Link to="/cars" className="btn btn-outline">
          Powrót do garażu
        </Link>
      </div>
    </div>
  );
}
