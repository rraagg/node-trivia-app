const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  choices: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  categories: { type: [String], default: [] }, // Default to an empty array
});

module.exports = mongoose.model("Question", QuestionSchema);
