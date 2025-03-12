import React, { useState, useEffect } from "react";
import axios from "axios";

interface Arrival {
  expected_date: string;
  started_date: string;
  finished_date: string;
  arrival_number: string;
  status: string;
  title: string;
  supplier: string;
  pallets: number;
  boxes: number;
  kilograms: number;
  pieces: number;
  received_pallets: number;
  received_boxes: number;
  received_kilograms: number;
  received_pieces: number;
}

const FinishedArrivals: React.FC = () => {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFinishedArrivals = async (): Promise<void> => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/arrivals/finished"
        );
        console.log(response.data);
        setArrivals(response.data);
      } catch (err) {
        console.error("Error fetching finished arrivals:", err);
        setError("Error fetching data. Please try again.");
      }
    };

    fetchFinishedArrivals();
  }, []);

  return (
    <div>
      <h2>Finished Arrivals</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Expected Date</th>
            <th>Started Date</th>
            <th>Finished Date</th>
            <th>Arrival Number</th>
            <th>Title</th>
            <th>Supplier</th>
            <th>Pallets</th>
            <th>Boxes</th>
            <th>Kilograms</th>
            <th>Pieces</th>
            <th>Received Pallets</th>
            <th>Received Boxes</th>
            <th>Received Kilograms</th>
            <th>Received Pieces</th>
          </tr>
        </thead>
        <tbody>
          {arrivals.length === 0 ? (
            <tr>
              <td colSpan={14}>No finished arrivals found.</td>
            </tr>
          ) : (
            arrivals.map((arrival) => (
              <tr key={arrival.arrival_number}>
                <td>{new Date(arrival.expected_date).toLocaleDateString()}</td>
                <td>{new Date(arrival.started_date).toLocaleDateString()}</td>
                <td>
                  {arrival.finished_date
                    ? new Date(arrival.finished_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{arrival.arrival_number}</td>
                <td>{arrival.title}</td>
                <td>{arrival.supplier}</td>
                <td>{arrival.pallets}</td>
                <td>{arrival.boxes}</td>
                <td>{arrival.kilograms}</td>
                <td>{arrival.pieces}</td>
                <td>{arrival.received_pallets}</td>
                <td>{arrival.received_boxes}</td>
                <td>{arrival.received_kilograms}</td>
                <td>{arrival.received_pieces}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinishedArrivals;
