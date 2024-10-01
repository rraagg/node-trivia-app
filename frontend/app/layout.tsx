// app/layout.tsx
"use client"; // Mark this file as a client component

import "./globals.css";
import ApolloProviderWrapper from "../components/ApolloProviderWrapper"; // Import the ApolloProviderWrapper
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>
          {" "}
          {/* Wrap the application with ApolloProvider */}
          <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Trivia App</h1>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="hover:text-gray-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/questions" className="hover:text-gray-300">
                    Questions
                  </a>
                </li>
              </ul>
            </nav>
          </header>
          <main className="container mx-auto p-4">{children}</main>
          <footer className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center p-4">
            <p>&copy; 2024 Trivia App</p>
          </footer>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
