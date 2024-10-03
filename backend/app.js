const express = require("express");
const connectDB = require("./config/db");
const setupGraphQL = require("./routes/graphql");
const logger = require("./utils/logger");
const uploadCsvRoute = require("./routes/upload-csv");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS globally to allow requests from http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000", // Only allow this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Include credentials (like cookies or authentication headers)
  }),
);

// Middleware to parse JSON bodies
app.use(express.json());

// Setup GraphQL - ensure it's done after CORS
setupGraphQL(app);

// File upload route after CORS is enabled
app.use("/api/upload-csv", uploadCsvRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger(`Server running on port ${PORT}`);
});
