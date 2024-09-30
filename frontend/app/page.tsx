// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Trivia App</h1>
      <p className="text-lg mb-6">
        Test your knowledge and create your own trivia questions!
      </p>

      {/* Link to the Questions Page */}
      <Link
        href="/questions"
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
      >
        Go to Questions
      </Link>
    </div>
  );
}
