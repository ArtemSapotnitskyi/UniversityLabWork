import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { FormEvent } from "react";
import type { NewCar } from "../models/Car";
import { getCarById, updateCar } from "../services/carService";

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<NewCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setCar({
          brand: data.brand,
          model: data.model,
          doorsNumber: data.doorsNumber,
          luggageCapacity: data.luggageCapacity,
          engineCapacity: data.engineCapacity,
          fuelType: data.fuelType,
          productionDate: data.productionDate,
          averageFuelConsumption: data.averageFuelConsumption,
          bodyType: data.bodyType,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load car.");
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !car) return;

    setSaving(true);
    setError("");

    try {
      await updateCar(id, car);
      navigate(`/cars/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update car.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Ładowanie formularza...</p>;
  if (!car) return <p>Car not found.</p>;

  return (
    <div>
      <h1>Konfiguracja pojazdu</h1>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Marka</label>
          <input
            type="text"
            className="form-control"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            className="form-control"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Liczba drzwi</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={car.doorsNumber}
            onChange={(e) =>
              setCar({ ...car, doorsNumber: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Bagażnik (l)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={car.luggageCapacity}
            onChange={(e) =>
              setCar({ ...car, luggageCapacity: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Silnik (cm³)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={car.engineCapacity}
            onChange={(e) =>
              setCar({ ...car, engineCapacity: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Rodzaj paliwa</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={car.fuelType}
            onChange={(e) =>
              setCar({ ...car, fuelType: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Data produkcji</label>
          <input
            type="date"
            className="form-control"
            value={car.productionDate}
            onChange={(e) => setCar({ ...car, productionDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Średnie spalanie (l/100km)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            step="0.1"
            value={car.averageFuelConsumption}
            onChange={(e) =>
              setCar({ ...car, averageFuelConsumption: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Typ nadwozia</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={car.bodyType}
            onChange={(e) =>
              setCar({ ...car, bodyType: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/cars/${id}`)}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}
