const express = require("express");
const connectDB = require("./config/db");
const setupGraphQL = require("./routes/graphql");
const logger = require("./utils/logger");
const uploadCsvRoute = require("./routes/upload-csv");
const registerUser = require("./routes/register.js");
const authRoutes = require("./routes/auth.js");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();


const allowedOrigins = [
  "http://localhost:3000", // Frontend
  "https://studio.apollographql.com", // Apollo Studio Sandbox
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// Middleware to parse JSON bodies
app.use(express.json());

// Enable session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET || "trivia_app_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    }, // Set to true if using HTTPS
  }),
);

// Setup GraphQL - ensure it's done after CORS
setupGraphQL(app);

// File upload route
app.use("/api/upload-csv", uploadCsvRoute);

// Register Users
app.use("/api/register", registerUser);

// Authentication Routes (auth-status and logout)
app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger(`Server running on port ${PORT}`);
});

