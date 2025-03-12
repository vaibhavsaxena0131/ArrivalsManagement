const pool = require("../db/db");

const arrivals = async (req, res) => {
  const status = "pending";
  const { expected_date, supplier, title, pallets, boxes, kilograms, pieces } =
    req.body;
  const result = await pool.query("SELECT COUNT(*) FROM arrivals");
  const arrivalCount = parseInt(result.rows[0].count) + 1;
  const arrivalNumber = `ARR-${String(arrivalCount).padStart(3, "0")}`;
  if (!expected_date || !supplier || !title) {
    return res
      .status(400)
      .json({ message: "Expected Date, Supplier, and Title are mandatory." });
  }
  const query = `
          INSERT INTO arrivals (arrival_number, expected_date, supplier, title, pallets, boxes, kilograms, pieces, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
      `;

  const values = [
    arrivalNumber,
    expected_date,
    supplier,
    title,
    pallets || null,
    boxes || null,
    kilograms || null,
    pieces || null,
    status,
  ];

  try {
    const response = await pool.query(query, values);
    const newArrival = response.rows[0];
    res
      .status(201)
      .json({ message: "Arrival created successfully!", arrival: newArrival });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating arrival." });
  }
};

const getUpcomingArrivals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * 
         FROM arrivals 
         WHERE status != 'finished' 
         ORDER BY expected_date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getFinishedArrivals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * 
         FROM arrivals 
         WHERE status = 'finished'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const startprocessing = async (req, res) => {
  const { arrival_number } = req.params;
  console.log(arrival_number);
  try {
    await pool.query(
      `
            UPDATE arrivals SET status = 'in_progress' WHERE arrival_number = $1
        `,
      [arrival_number]
    );
    res.status(200).json({ message: "Arrival processing started" });
  } catch (error) {
    console.error("Error starting processing:", error);
    res.status(500).json({ error: "Failed to start processing" });
  }
};

const continueprocessing = async (req, res) => {
  const { arrival_number } = req.params;
  try {
    await pool.query(
      `
            UPDATE arrivals SET status = 'in_progress' WHERE arrival_number = $1
        `,
      [arrival_number]
    );
    res.status(200).json({ message: "Arrival processing continued" });
  } catch (error) {
    console.error("Error continuing processing:", error);
    res.status(500).json({ error: "Failed to continue processing" });
  }
};

const editarrival = async (req, res) => {
  const { arrival_number } = req.params;
  const { title, supplier, expected_date, pallets, boxes, kilograms, pieces } =
    req.body;

  try {
    await pool.query(
      `
        UPDATE arrivals 
        SET 
          title = $1, 
          supplier = $2, 
          expected_date = $3, 
          pallets = $4, 
          boxes = $5, 
          kilograms = $6, 
          pieces = $7
        WHERE arrival_number = $8
      `,
      [
        title,
        supplier,
        expected_date,
        pallets,
        boxes,
        kilograms,
        pieces,
        arrival_number,
      ]
    );
    res.status(200).json({ message: "Arrival updated successfully" });
  } catch (error) {
    console.error("Error editing arrival:", error);
    res.status(500).json({ error: "Failed to edit arrival" });
  }
};

const Dropdowns = async (req, res) => {
  try {
    const staticBrands = [
      { id: 1, name: "Brand A" },
      { id: 2, name: "Brand B" },
      { id: 3, name: "Brand C" },
    ];

    const staticCategories = [
      { id: 1, name: "Category A" },
      { id: 2, name: "Category B" },
      { id: 3, name: "Category C" },
    ];

    const staticSizes = [
      { id: 1, name: "Small" },
      { id: 2, name: "Medium" },
      { id: 3, name: "Large" },
    ];

    const staticColors = [
      { id: 1, name: "Red" },
      { id: 2, name: "Blue" },
      { id: 3, name: "Green" },
    ];

    const staticConditions = [
      { id: 1, name: "New" },
      { id: 2, name: "Used" },
      { id: 3, name: "Refurbished" },
    ];

    res.json({
      brands: staticBrands,
      categories: staticCategories,
      sizes: staticSizes,
      colors: staticColors,
      conditions: staticConditions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dropdown data" });
  }
};

const Products = async (req, res) => {
  const {
    barcode,
    brandId,
    categoryId,
    sizeId,
    colorId,
    conditionId,
    style,
    quantity,
  } = req.body;
  const query = `
    INSERT INTO products (barcode, brandId, categoryId, sizeId, colorId, conditionId, style, quantity)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  try {
    await pool.query(query, [
      barcode,
      brandId,
      categoryId,
      sizeId,
      colorId,
      conditionId,
      style,
      quantity,
    ]);
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ message: "Error creating product." });
  }
};

const productsbarcode = async (req, res) => {
  const { barcode } = req.params;
  try {
    const product = await pool.query(
      "SELECT * FROM products WHERE barcode = $1",
      [barcode]
    );
    if (product.rows.length > 0) {
      res.json(product.rows[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product data" });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

module.exports = {
  arrivals,
  getUpcomingArrivals,
  getFinishedArrivals,
  startprocessing,
  continueprocessing,
  editarrival,
  Dropdowns,
  Products,
  productsbarcode,
  getProducts,
};
