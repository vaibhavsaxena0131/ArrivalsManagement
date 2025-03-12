import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./CreateArrivals.css";

interface CreateArrivalResponse {
  message: string;
}

const CreateArrival = () => {
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [supplier, setSupplier] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [pallets, setPallets] = useState<string | null>("");
  const [boxes, setBoxes] = useState<string | null>("");
  const [kilograms, setKilograms] = useState<string | null>("");
  const [pieces, setPieces] = useState<string | null>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!expectedDate || !supplier || !title) {
      setError("Expected Date, Supplier, and Title are mandatory.");
      return;
    }

    try {
      const response = await axios.post<CreateArrivalResponse>(
        "http://localhost:5000/api/create-arrival",
        {
          expected_date: expectedDate,
          supplier,
          title,
          pallets: pallets || null,
          boxes: boxes || null,
          kilograms: kilograms || null,
          pieces: pieces || null,
        }
      );

      setSuccessMessage(response.data.message);
      setError("");
      setExpectedDate("");
      setSupplier("");
      setTitle("");
      setPallets(null);
      setBoxes(null);
      setKilograms(null);
      setPieces(null);
    } catch (err: any) {
      setError("Error creating arrival: " + err.response.data.message);
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <div className="form-container">
      <h2 className="form-header">Create New Arrival</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="expectedDate" className="form-label">
            Expected Date
          </label>
          <input
            id="expectedDate"
            type="date"
            value={expectedDate}
            onChange={handleChange(setExpectedDate)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="supplier" className="form-label">
            Supplier
          </label>
          <input
            id="supplier"
            type="text"
            value={supplier}
            onChange={handleChange(setSupplier)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleChange(setTitle)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pallets" className="form-label">
            Pallets
          </label>
          <input
            id="pallets"
            type="number"
            value={pallets ?? ""}
            onChange={handleChange(setPallets)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="boxes" className="form-label">
            Boxes
          </label>
          <input
            id="boxes"
            type="number"
            value={boxes ?? ""}
            onChange={handleChange(setBoxes)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="kilograms" className="form-label">
            Kilograms
          </label>
          <input
            id="kilograms"
            type="number"
            step="0.01"
            value={kilograms ?? ""}
            onChange={handleChange(setKilograms)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pieces" className="form-label">
            Pieces
          </label>
          <input
            id="pieces"
            type="number"
            value={pieces ?? ""}
            onChange={handleChange(setPieces)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Create Arrival
        </button>
      </form>
    </div>
  );
};

export default CreateArrival;
