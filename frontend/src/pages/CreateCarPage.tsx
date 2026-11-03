import { useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import type { NewCar } from "../models/Car";
import { createCar } from "../services/carService";

export default function CreateCarPage() {
  const navigate = useNavigate();

  const [car, setCar] = useState<NewCar>({
    brand: "",
    model: "",
    doorsNumber: 4,
    luggageCapacity: 0,
    engineCapacity: 0,
    fuelType: 0,
    productionDate: "",
    averageFuelConsumption: 0,
    bodyType: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createCar(car);
      navigate("/cars");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create car.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Rejestracja Nowego Pojazdu</h1>

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
            {saving ? "Dodawanie..." : "Dodaj pojazd do bazy"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/cars")}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}
