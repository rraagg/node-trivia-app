// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trivia App</h1>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/questions" className="hover:text-gray-300">
                Questions
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center p-4">
        <p>&copy; 2024 Trivia App</p>
      </footer>
    </div>
  );
}
