const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Check Authentication Status
router.get("/auth-status", (req, res) => {
  console.log("Cookies:", req.headers.cookie); // Fixed incorrect method for headers
  console.log("Session:", req.session);
  if (req.session?.user) {
    return res.status(200).json({ authenticated: true, user: req.session.user });
  }
  res.status(401).json({ authenticated: false });
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Store user details in the session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    // Set the session cookie explicitly
    res.cookie("connect.sid", req.session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Failed to log out" });
    }

    // Explicitly clear the cookie
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;

