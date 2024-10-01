"use client";

import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

const GET_QUESTIONS = gql`
  query GetQuestions {
    getQuestions {
      id
      questionText
      correctAnswer
      categories
    }
  }
`;

// Function to generate a random color for each category
const getRandomColor = (index: number) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  return colors[index % colors.length]; // Return colors in a loop based on index
};

export default function QuestionsPage() {
  const { loading, error, data } = useQuery(GET_QUESTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Questions List</h1>

      {/* Add New Question button */}
      <Link href="/add-question">
        <button className="mb-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Add New Question
        </button>
      </Link>

      <ul className="space-y-4">
        {data.getQuestions.map(
          (
            question: {
              id: string;
              questionText: string;
              correctAnswer: string;
              categories: string[];
            },
            index: number,
          ) => (
            <li
              key={question.id}
              className="flex justify-between items-start border-b pb-4"
            >
              {/* Question text and correct answer */}
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {question.questionText}
                </h2>
                <p className="text-gray-600 mb-2">
                  Correct Answer: {question.correctAnswer}
                </p>

                {/* Categories displayed as buttons */}
                <div className="flex space-x-2">
                  {question.categories.map(
                    (category: string, catIndex: number) => (
                      <span
                        key={catIndex}
                        className={`text-white px-3 py-1 rounded-full ${getRandomColor(catIndex)}`}
                      >
                        {category}
                      </span>
                    ),
                  )}
                </div>
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
