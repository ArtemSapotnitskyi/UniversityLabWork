import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import type { Car } from "../models/Car";
import { getCars, deleteCar } from "../services/carService";
import { useCarUiStore } from "../store/useCarUiStore";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");

  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore(
    (state) => state.setShowFavoritesOnly,
  );
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCars(controller.signal);
        setCars(data);
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

    loadCars();

    return () => {
      controller.abort();
    };
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
      removeFavorite(id);
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete car.");
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite =
      !showFavoritesOnly || favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
  });

  if (loading) return <p>Ładowanie garażu...</p>;
  if (error) return <p style={{ color: "var(--danger)" }}>Błąd: {error}</p>;

  return (
    <div>
      <h1>Twój Garaż</h1>

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Tylko ulubione
        </label>
      </div>

      {cars.length === 0 ? (
        <p>Brak samochodów w bazie.</p>
      ) : visibleCars.length === 0 ? (
        <p>Nie znaleziono samochodów o takich parametrach.</p>
      ) : (
        <div className="car-grid">
          {visibleCars.map((car) => {
            const isFavorite = favoriteCarIds.includes(car.id);

            return (
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
                    type="button"
                    className={
                      isFavorite
                        ? "btn favorite-button active-favorite"
                        : "btn favorite-button"
                    }
                    onClick={() => toggleFavorite(car.id)}
                  >
                    {isFavorite ? "Ulubiony" : "Ulubione"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(car.id)}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
