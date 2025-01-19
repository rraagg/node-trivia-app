"use client";

import "./globals.css";
import ApolloProviderWrapper from "../components/ApolloProviderWrapper";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ApolloProviderWrapper>
          <AuthProvider>
            <Header />
            <main className="container mx-auto p-4 flex-grow">{children}</main>
            <footer className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center p-4">
              <p>&copy; 2024 Trivia App. All rights reserved.</p>
            </footer>
          </AuthProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}

function Header() {
  const { isAuthenticated, loading, checkAuth, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false); // Update state immediately
        checkAuth(); // Recheck auth status
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trivia App</h1>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/questions">Questions</Link>
            </li>
            <li>Loading...</li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trivia App</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/questions">Questions</Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/register">Register</Link>
              </li>
              <li>
                <Link href="/login">Login</Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
