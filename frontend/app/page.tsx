"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-grow items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Trivia App!</h1>

        {/* Links displayed side by side */}
        <div className="flex justify-center space-x-4">
          <Link href="/questions">
            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
              Go to Questions
            </button>
          </Link>
          <Link href="/play-trivia">
            <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
              Play Trivia
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
