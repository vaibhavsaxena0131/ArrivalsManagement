const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routers/routes");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
