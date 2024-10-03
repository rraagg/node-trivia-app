const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const mongoSanitize = require("mongo-sanitize");
const fs = require("fs");
const path = require("path");
const Question = require("../models/Question");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST route for uploading CSV
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  const questions = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      // Sanitize inputs to prevent NoSQL injection
      const sanitizedQuestionText = mongoSanitize(row.questionText);
      const sanitizedChoices = row.choices
        .split("|")
        .map((choice) => mongoSanitize(choice));
      const sanitizedCorrectAnswer = mongoSanitize(row.correctAnswer);
      const sanitizedCategories = row.categories
        .split("|")
        .map((category) => mongoSanitize(category));

      questions.push({
        questionText: sanitizedQuestionText,
        choices: sanitizedChoices,
        correctAnswer: sanitizedCorrectAnswer,
        categories: sanitizedCategories,
      });
    })
    .on("end", async () => {
      try {
        await Question.insertMany(questions); // Insert questions into the DB
        fs.unlinkSync(filePath); // Delete the uploaded file after processing
        res.status(200).json({ message: "File uploaded successfully" });
      } catch (error) {
        console.error(error);
        fs.unlinkSync(filePath); // Clean up the file on error
        res.status(500).json({ error: "Error processing file" });
      }
    })
    .on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: "Error reading file" });
    });
});

module.exports = router;
