// lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Your GraphQL server endpoint
  cache: new InMemoryCache(),
});

export default client;
