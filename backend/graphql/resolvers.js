const Question = require("../models/Question");
const mongoSanitize = require("mongo-sanitize");

const resolvers = {
  Query: {
    getQuestions: async () => {
      return await Question.find();
    },
    getQuestion: async (_, { id }) => {
      const sanitizedId = mongoSanitize(id); // Sanitize the input
      return await Question.findById(sanitizedId);
    },
  },
  Mutation: {
    addQuestion: async (
      _,
      { questionText, choices, correctAnswer, categories },
    ) => {
      // Sanitize inputs before saving to the database
      const sanitizedQuestionText = mongoSanitize(questionText);
      const sanitizedChoices = choices.map((choice) => mongoSanitize(choice));
      const sanitizedCorrectAnswer = mongoSanitize(correctAnswer);
      const sanitizedCategories = categories.map((category) =>
        mongoSanitize(category),
      );

      const question = new Question({
        questionText: sanitizedQuestionText,
        choices: sanitizedChoices,
        correctAnswer: sanitizedCorrectAnswer,
        categories: sanitizedCategories,
      });

      return await question.save();
    },
    updateQuestion: async (_, { id, questionText, choices, correctAnswer }) => {
      // Sanitize inputs
      const sanitizedId = mongoSanitize(id);
      const sanitizedUpdates = {
        ...(questionText && { questionText: mongoSanitize(questionText) }),
        ...(choices && {
          choices: choices.map((choice) => mongoSanitize(choice)),
        }),
        ...(correctAnswer && { correctAnswer: mongoSanitize(correctAnswer) }),
      };

      return await Question.findByIdAndUpdate(sanitizedId, sanitizedUpdates, {
        new: true,
      });
    },
    deleteQuestion: async (_, { id }) => {
      const sanitizedId = mongoSanitize(id); // Sanitize the ID
      await Question.findByIdAndDelete(sanitizedId);
      return "Question deleted";
    },
  },
};

module.exports = resolvers;
