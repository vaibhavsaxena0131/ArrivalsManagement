import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import "./Products.css";

interface Dropdown {
  id: string;
  name: string;
}

interface Dropdowns {
  brands: Dropdown[];
  categories: Dropdown[];
  sizes: Dropdown[];
  colors: Dropdown[];
  conditions: Dropdown[];
}

interface FormData {
  barcode: string;
  brandId: string;
  categoryId: string;
  sizeId: string;
  colorId: string;
  conditionId: string;
  style: string;
  quantity: string;
}

const ProductForm: React.FC = () => {
  const [dropdowns, setDropdowns] = useState<Dropdowns>({
    brands: [],
    categories: [],
    sizes: [],
    colors: [],
    conditions: [],
  });
  const [formData, setFormData] = useState<FormData>({
    barcode: "",
    brandId: "",
    categoryId: "",
    sizeId: "",
    colorId: "",
    conditionId: "",
    style: "",
    quantity: "",
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [scannerStart, setScannerStart] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dropdowns")
      .then((response) => {
        setDropdowns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dropdown data:", error);
      });
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleScan = (data: any) => {
    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        barcode: data.text,
      }));
      setScannerStart(false);
      setScannerStarted(true);
    }
  };

  const handleError = (err: any) => {
    console.error("Scan error: ", err);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages([]);
    const errors: string[] = [];
    if (!formData.categoryId || !formData.conditionId || !formData.quantity) {
      errors.push("Category, Condition, and Quantity are mandatory.");
    }
    if (
      !formData.quantity ||
      isNaN(Number(formData.quantity)) ||
      parseInt(formData.quantity) <= 0
    ) {
      errors.push("Quantity must be a positive integer.");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    axios
      .post("http://localhost:5000/api/products", formData)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error submitting product:", error);
        alert("Error submitting product.");
      });
  };

  const handleScannerToggle = () => {
    setScannerStart((prev) => !prev);
    setScannerStarted(false);
  };

  return (
    <div className="product-form-container">
      <h2 className="product-form-title">Product Arrival Form</h2>

      <form onSubmit={handleSubmit} className="product-form">
        {errorMessages.length > 0 && (
          <ul className="error-messages">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        )}

        {!scannerStarted && (
          <div>
            <button
              type="button"
              onClick={handleScannerToggle}
              className="start-scan-button"
            >
              {scannerStart ? "Stop Scanner" : "Start Scanner"}
            </button>
          </div>
        )}
        {scannerStart && (
          <div className="barcode-scanner">
            <h3>Scan Barcode</h3>
            <BarcodeScannerComponent
              onUpdate={(err, result) => {
                if (result) handleScan(result);
                else handleError(err);
              }}
            />
          </div>
        )}
        <div className="input-group">
          <label className="label-barcode">Barcode:</label>
          <input
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleInputChange}
            className="input-barcode"
            placeholder="Enter Barcode"
            readOnly
          />
        </div>
        <div className="input-group">
          <label className="label-brand">Brand:</label>
          <select
            name="brandId"
            value={formData.brandId}
            onChange={handleInputChange}
            className="select-brand"
          >
            <option value="">Select Brand</option>
            {dropdowns.brands &&
              dropdowns.brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label-category">Category:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="select-category"
          >
            <option value="">Select Category</option>
            {dropdowns.categories &&
              dropdowns.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label-size">Size:</label>
          <select
            name="sizeId"
            value={formData.sizeId}
            onChange={handleInputChange}
            className="select-size"
          >
            <option value="">Select Size</option>
            {dropdowns.sizes &&
              dropdowns.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label-color">Color:</label>
          <select
            name="colorId"
            value={formData.colorId}
            onChange={handleInputChange}
            className="select-color"
          >
            <option value="">Select Color</option>
            {dropdowns.colors &&
              dropdowns.colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label-condition">Condition:</label>
          <select
            name="conditionId"
            value={formData.conditionId}
            onChange={handleInputChange}
            required
            className="select-condition"
          >
            <option value="">Select Condition</option>
            {dropdowns.conditions &&
              dropdowns.conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.name}
                </option>
              ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label-style">Style:</label>
          <input
            type="text"
            name="style"
            value={formData.style}
            onChange={handleInputChange}
            className="input-style"
          />
        </div>
        <div className="input-group">
          <label className="label-quantity">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            className="input-quantity"
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
