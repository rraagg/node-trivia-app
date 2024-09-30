// pages/_app.js
import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client"; // Import Apollo Client from the configuration file
import Layout from "../components/Layout"; // Import the Layout component

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
