// graphql/resolvers.js
const Question = require("../models/Question");

const resolvers = {
  Query: {
    getQuestions: async () => {
      return await Question.find();
    },
    getQuestion: async (_, { id }) => {
      return await Question.findById(id);
    },
  },
  Mutation: {
    // Add the categories input to the addQuestion mutation
    addQuestion: async (
      _,
      { questionText, choices, correctAnswer, categories },
    ) => {
      const question = new Question({
        questionText,
        choices,
        correctAnswer,
        categories: categories || [], // Default to an empty array if no categories are provided
      });
      await question.save();
      return question;
    },

    // Add the ability to update categories in the updateQuestion mutation
    updateQuestion: async (
      _,
      { id, questionText, choices, correctAnswer, categories },
    ) => {
      const updates = {};
      if (questionText) updates.questionText = questionText;
      if (choices) updates.choices = choices;
      if (correctAnswer) updates.correctAnswer = correctAnswer;
      if (categories) updates.categories = categories;

      const updatedQuestion = await Question.findByIdAndUpdate(id, updates, {
        new: true,
      });

      return updatedQuestion;
    },

    // Delete the question by ID
    deleteQuestion: async (_, { id }) => {
      await Question.findByIdAndDelete(id);
      return "Question deleted";
    },
  },

  // Ensure that categories always return an array, even if it's null or undefined
  Question: {
    categories: (parent) => {
      return parent.categories ? parent.categories : [];
    },
  },
};

module.exports = resolvers;
