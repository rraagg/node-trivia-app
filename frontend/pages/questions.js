// pages/questions.js
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
    <div>
      <h1 className="text-3xl font-bold mb-4">Questions List</h1>

      <div className="flex space-x-4 mb-6">
        <Link
          href="/add-question"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Question
        </Link>
      </div>

      <ul className="space-y-4">
        {data.getQuestions.map((question) => (
          <li key={question.id} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {question.questionText}
                </h2>
                <p className="text-gray-600">
                  Correct Answer: {question.correctAnswer}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/update-question/${question.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Update
                </Link>
                <Link
                  href={`/delete-question/${question.id}`}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
