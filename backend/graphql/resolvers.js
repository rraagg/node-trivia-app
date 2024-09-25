// graphql/resolvers.js
const Question = require("../models/Question");

const resolvers = {
  Query: {
    getQuestions: async () => await Question.find(),
    getQuestion: async (_, { id }) => await Question.findById(id),
  },
  Mutation: {
    addQuestion: async (_, { questionText, choices, correctAnswer }) => {
      const question = new Question({ questionText, choices, correctAnswer });
      await question.save();
      return question;
    },
    updateQuestion: async (_, { id, questionText, choices, correctAnswer }) => {
      const updates = {};
      if (questionText) updates.questionText = questionText;
      if (choices) updates.choices = choices;
      if (correctAnswer) updates.correctAnswer = correctAnswer;
      const updatedQuestion = await Question.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return updatedQuestion;
    },
    deleteQuestion: async (_, { id }) => {
      await Question.findByIdAndDelete(id);
      return "Question deleted";
    },
  },
};

module.exports = resolvers;
