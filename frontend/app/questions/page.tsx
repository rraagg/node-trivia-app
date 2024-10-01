"use client";

import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

const GET_QUESTIONS = gql`
  query GetQuestions {
    getQuestions {
      id
      questionText
      correctAnswer
    }
  }
`;

export default function QuestionsPage() {
  const { loading, error, data } = useQuery(GET_QUESTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Questions List</h1>

        {/* Add New Question button with spacing */}
        <Link href="/add-question">
          <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            Add New Question
          </button>
        </Link>
      </div>

      <ul className="space-y-4">
        {data.getQuestions.map(
          (question: {
            id: string;
            questionText: string;
            correctAnswer: string;
          }) => (
            <li
              key={question.id}
              className="flex justify-between items-center border-b pb-2"
            >
              {/* Question text and correct answer */}
              <div>
                <h2 className="text-xl font-semibold">
                  {question.questionText}
                </h2>
                <p className="text-gray-600">
                  Correct Answer: {question.correctAnswer}
                </p>
              </div>

              {/* Update and Delete buttons */}
              <div className="space-x-2">
                <Link href={`/update-question/${question.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update
                  </button>
                </Link>
                <Link href={`/delete-question/${question.id}`}>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Delete
                  </button>
                </Link>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
