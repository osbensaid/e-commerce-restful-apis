const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const categoryRouters = require("./routes/CategoryRoutes");
const subCategoryRouters = require("./routes/subCategoryRoutes");
const ApiErrors = require("./libraries/apiErrors");
const globalError = require("./middlewares/errrorMiddleware");

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
app.use("/api/v1/subcategories", subCategoryRouters);

app.all("*", (req, res, next) => {
  next(new ApiErrors(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express.
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server ruuning on port ${PORT}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
