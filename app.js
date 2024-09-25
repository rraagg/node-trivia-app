// app.js
const express = require("express");
const connectDB = require("./config/db");
const setupGraphQL = require("./routes/graphql");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Setup GraphQL
setupGraphQL(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger(`Server running on port ${PORT}`);
});
