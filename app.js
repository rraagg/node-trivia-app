const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
require("dotenv").config();

const app = express();

const dbURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;

console.log(dbURI);

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const questionSchema = new mongoose.Schema({
  questionText: String,
  choices: [String],
  correctAnswer: String,
});

const Question = mongoose.model("Question", questionSchema);

const typeDefs = gql`
  type Question {
    id: ID!
    questionText: String!
    choices: [String!]!
    correctAnswer: String!
  }
  type Query {
    getQuestions: [Question]
  }
  type Mutation {
    addQuestion(
      questionText: String!
      choices: [String!]!
      correctAnswer: String!
    ): Question
  }
`;

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

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`),
  );
}
startApolloServer();
