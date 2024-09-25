const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

mongoose.connect("mongodb://localhost/trivia-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
