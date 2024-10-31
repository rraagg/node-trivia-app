const Question = require("../models/Question");
const mongoSanitize = require("mongo-sanitize");

const resolvers = {
  Query: {
    getQuestions: async (_, { categories = [], numQuestions = 5 }) => {
      console.log("getQuestions called with:", { categories, numQuestions });

      let pipeline = [];

      // Log the category filtering step
      if (categories.length > 0) {
        console.log("Filtering by categories:", categories);
        pipeline.push({ $match: { categories: { $in: categories } } });
      } else {
        console.log("No categories specified; retrieving all categories.");
      }

      // Random sampling step with logging
      console.log("Random sampling with size:", numQuestions);
      pipeline.push({ $sample: { size: numQuestions } });

      const questions = await Question.aggregate(pipeline);
      console.log("Questions retrieved before mapping:", questions);

      // Map MongoDB `_id` to `id`
      const mappedQuestions = questions.map((question) => ({
        ...question,
        id: question._id.toString(), // Map `_id` to `id`
      }));

      console.log("Questions after mapping:", mappedQuestions);
      return mappedQuestions;
    },
    getCategories: async () => {
      const categories = await Question.distinct("categories");
      console.log("Categories retrieved:", categories);
      return categories;
    },
    getQuestion: async (_, { id }) => {
      const sanitizedId = mongoSanitize(id);
      console.log("getQuestion called with ID:", sanitizedId);
      const question = await Question.findById(sanitizedId);
      console.log("Question found:", question);
      return question;
    },
  },
};

module.exports = resolvers;
