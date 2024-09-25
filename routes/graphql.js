const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");

const setupGraphQL = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });
};

module.exports = setupGraphQL;
