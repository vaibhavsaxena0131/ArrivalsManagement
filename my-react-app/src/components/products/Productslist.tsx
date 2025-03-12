import React, { useState, useEffect } from "react";
import axios from "axios";
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  size: string;
  color: string;
  condition: string;
  style: string;
  quantity: string;
  barcode: string;
}

const ProductUpdated: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching products");
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div>Loading products...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="updated-products-container">
      <h1>Updated Products</h1>

      {products.length === 0 ? (
        <p>No updated products available.</p>
      ) : (
        <table className="updated-products-table">
          <thead>
            <tr>
              <th>BarcodeId</th>
              <th>BrandId</th>
              <th>CategoryId</th>
              <th>SizeId</th>
              <th>ColorId</th>
              <th>ConditionId</th>
              <th>Style</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.barcode}</td>
                <td>{product.brandid}</td>
                <td>{product.categoryid}</td>
                <td>{product.sizeid}</td>
                <td>{product.colorid}</td>
                <td>{product.conditionid}</td>
                <td>{product.style}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductUpdated;
