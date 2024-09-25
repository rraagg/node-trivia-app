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
    getQuestion(id: ID!): Question
  }

  type Mutation {
    addQuestion(
      questionText: String!
      choices: [String!]!
      correctAnswer: String!
    ): Question
    updateQuestion(
      id: ID!
      questionText: String
      choices: [String!]
      correctAnswer: String!
    ): Question
    deleteQuestion(id: ID!): String
  }
`;

module.exports = typeDefs;
