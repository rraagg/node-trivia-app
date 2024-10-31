"use client";

import { useEffect } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

const GET_QUESTIONS = gql`
  query GetQuestions($categories: [String!], $numQuestions: Int!) {
    getQuestions(categories: $categories, numQuestions: $numQuestions) {
      id
      questionText
      correctAnswer
      categories
    }
  }
`;

export default function QuestionsPage() {
  // Providing default values for categories and numQuestions
  const { loading, error, data, refetch } = useQuery(GET_QUESTIONS, {
    variables: { categories: [], numQuestions: 10 },
  });

  // Refetch the questions every time the component is rendered
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Questions List</h1>

      {/* Upload CSV link */}
      <div className="mb-6">
        <Link href="/upload-csv">
          <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
            Upload CSV
          </button>
        </Link>
      </div>

      {/* Add New Question button */}
      <Link href="/add-question">
        <button className="mb-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Add New Question
        </button>
      </Link>

      <ul className="space-y-4">
        {data.getQuestions.map(
          (question: {
            id: string;
            questionText: string;
            correctAnswer: string;
            categories: string[];
          }) => (
            <li
              key={question.id}
              className="flex justify-between items-start border-b pb-4"
            >
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
                    (category: string, index: number) => (
                      <span
                        key={index}
                        className={`text-white px-3 py-1 rounded-full bg-blue-500`}
                      >
                        {category}
                      </span>
                    ),
                  )}
                </div>
              </div>

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
