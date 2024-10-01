// components/ApolloProviderWrapper.tsx
"use client"; // Ensure this is a client component

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client"; // Ensure the path is correct
import { ReactNode } from "react";

export default function ApolloProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
