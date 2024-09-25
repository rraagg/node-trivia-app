const { gql } = require("apollo-server-express");

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

module.exports = typeDefs;
