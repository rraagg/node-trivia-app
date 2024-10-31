const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Question {
    id: ID!
    questionText: String!
    choices: [String!]!
    correctAnswer: String!
    categories: [String!]!
  }

  type Query {
    getQuestions(categories: [String!], numQuestions: Int!): [Question]
    getQuestion(id: ID!): Question
    getCategories: [String!]
  }

  type Mutation {
    addQuestion(
      questionText: String!
      choices: [String!]!
      correctAnswer: String!
      categories: [String!]!
    ): Question
    updateQuestion(
      id: ID!
      questionText: String
      choices: [String!]
      correctAnswer: String!
      categories: [String!]!
    ): Question
    deleteQuestion(id: ID!): String
  }
`;

module.exports = typeDefs;
