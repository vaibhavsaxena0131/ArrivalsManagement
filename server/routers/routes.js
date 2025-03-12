const express = require("express");
const router = express.Router();
const {
  arrivals,
  getUpcomingArrivals,
  getFinishedArrivals,
  startprocessing,
  continueprocessing,
  editarrival,
  Dropdowns,
  Products,
  getProducts,
} = require("../controllers/arrivalController");
router.post("/create-arrival", arrivals);
router.post("/start-processing/:arrival_number", startprocessing);
router.post("/continue-processing/:arrival_number", continueprocessing);
router.put("/edit-arrival/:arrival_number", editarrival);
router.get("/arrivals/upcoming", getUpcomingArrivals);
router.get("/arrivals/finished", getFinishedArrivals);
router.get("/dropdowns", Dropdowns);
router.post("/products", Products);
router.get("/products/:barcode", Products);
router.get("/products", getProducts);

module.exports = router;
