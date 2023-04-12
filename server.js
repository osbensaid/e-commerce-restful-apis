const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const categoryRouters = require("./routes/categoryRoutes");

// Connect with Database.
dbConnection();

// Express App
const app = express();

// Midlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

// Mount Routes
app.use("/api/v1/categories", categoryRouters);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server ruuning on port ${PORT}`);
});
