const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Question = require("../models/Question"); // Your Question model

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// POST route for uploading CSV
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  const questions = [];

  // Parse the CSV file
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      const { questionText, choices, correctAnswer, categories } = row;
      questions.push({
        questionText,
        choices: choices.split("|"),
        correctAnswer,
        categories: categories.split("|"),
      });
    })
    .on("end", async () => {
      try {
        await Question.insertMany(questions); // Insert questions into the DB
        fs.unlinkSync(filePath); // Delete the file after processing
        res.status(200).json({ message: "File uploaded successfully" }); // Send response after processing
      } catch (error) {
        console.error(error);
        fs.unlinkSync(filePath); // Clean up file on error
        res.status(500).json({ error: "Error processing file" });
      }
    })
    .on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: "Error reading file" });
    });
});

module.exports = router;
