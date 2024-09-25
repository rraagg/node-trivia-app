const Question = require("../models/Question");

const resolvers = {
  Query: {
    getQuestions: async () => await Question.find(),
  },
  Mutation: {
    addQuestion: async (_, { questionText, choices, correctAnswer }) => {
      const question = new Question({ questionText, choices, correctAnswer });
      await question.save();
      return question;
    },
  },
};

module.exports = resolvers;
