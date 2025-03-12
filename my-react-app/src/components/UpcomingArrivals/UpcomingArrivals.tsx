import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpcomingArrivals.css";

interface Arrival {
  arrival_number: string;
  expected_date: string;
  title: string;
  supplier: string;
  pallets: number;
  boxes: number;
  kilograms: number;
  pieces: number;
  status?: string;
}

const UpcomingArrivals: React.FC = () => {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [editingArrival, setEditingArrival] = useState<Arrival | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUpcomingArrivals = async (): Promise<void> => {
      try {
        const response = await axios.get<Arrival[]>(
          "http://localhost:5000/api/arrivals/upcoming"
        );
        setArrivals(response.data);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      }
    };

    fetchUpcomingArrivals();
  }, []);

  const handleStartProcessing = async (
    arrivalNumber: string
  ): Promise<void> => {
    try {
      await axios.post(
        `http://localhost:5000/api/start-processing/${arrivalNumber}`
      );
      setArrivals((prevArrivals) =>
        prevArrivals.map((arrival) =>
          arrival.arrival_number === arrivalNumber
            ? { ...arrival, status: "in_progress" }
            : arrival
        )
      );
      alert(`Processing for arrival ${arrivalNumber} has started.`);
    } catch (err) {
      setError("Failed to start processing. Please try again.");
    }
  };

  const handleContinueProcessing = async (
    arrivalNumber: string
  ): Promise<void> => {
    try {
      await axios.post(
        `http://localhost:5000/api/continue-processing/${arrivalNumber}`
      );
      setArrivals((prevArrivals) =>
        prevArrivals.map((arrival) =>
          arrival.arrival_number === arrivalNumber
            ? { ...arrival, status: "in_progress" }
            : arrival
        )
      );
      alert(`Processing for arrival ${arrivalNumber} is continuing.`);
    } catch (err) {
      setError("Failed to continue processing. Please try again.");
    }
  };

  const handleEditArrival = (arrival: Arrival): void => {
    setEditingArrival(arrival);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (editingArrival) {
      try {
        await axios.put(
          `http://localhost:5000/api/edit-arrival/${editingArrival.arrival_number}`,
          editingArrival
        );
        setArrivals((prevArrivals) =>
          prevArrivals.map((arrival) =>
            arrival.arrival_number === editingArrival.arrival_number
              ? editingArrival
              : arrival
          )
        );
        alert("Arrival updated successfully.");
        setEditingArrival(null);
      } catch (err) {
        setError("Failed to update arrival. Please try again.");
      }
    }
  };

  const handleCancelEdit = (): void => {
    setEditingArrival(null);
  };

  return (
    <div className="container">
      <h2>Upcoming Arrivals</h2>
      {error && <div className="error-message">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Expected Date</th>
            <th>Arrival Number</th>
            <th>Title</th>
            <th>Supplier</th>
            <th>Pallets</th>
            <th>Boxes</th>
            <th>Kilograms</th>
            <th>Pieces</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {arrivals.length === 0 ? (
            <tr>
              <td colSpan={9}>No upcoming arrivals found.</td>
            </tr>
          ) : (
            arrivals.map((arrival) => (
              <tr key={arrival.arrival_number}>
                <td>{new Date(arrival.expected_date).toLocaleDateString()}</td>
                <td>{arrival.arrival_number}</td>
                <td>{arrival.title}</td>
                <td>{arrival.supplier}</td>
                <td>{arrival.pallets}</td>
                <td>{arrival.boxes}</td>
                <td>{arrival.kilograms}</td>
                <td>{arrival.pieces}</td>
                <td>
                  <button
                    onClick={() =>
                      handleStartProcessing(arrival.arrival_number)
                    }
                  >
                    Start Processing
                  </button>
                  <button
                    onClick={() =>
                      handleContinueProcessing(arrival.arrival_number)
                    }
                  >
                    Continue Processing
                  </button>
                  <button onClick={() => handleEditArrival(arrival)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingArrival && (
        <div className="edit-form">
          <h3>Edit Arrival</h3>
          <form>
            <label>
              Title:
              <input
                type="text"
                value={editingArrival.title}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    title: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Supplier:
              <input
                type="text"
                value={editingArrival.supplier}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    supplier: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Pallets:
              <input
                type="text"
                value={editingArrival.pallets}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    pallets: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Boxes:
              <input
                type="text"
                value={editingArrival.boxes}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    boxes: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Kilograms:
              <input
                type="text"
                value={editingArrival.kilograms}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    kilograms: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Pieces:
              <input
                type="text"
                value={editingArrival.pieces}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    pieces: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Expected Date:
              <input
                type="date"
                value={editingArrival.expected_date}
                onChange={(e) =>
                  setEditingArrival({
                    ...editingArrival,
                    expected_date: e.target.value,
                  })
                }
              />
            </label>
            <button type="button" onClick={handleSaveEdit}>
              Save
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpcomingArrivals;
