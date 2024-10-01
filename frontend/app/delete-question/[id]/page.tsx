"use client";

import { useParams, useRouter } from "next/navigation";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_QUESTION = gql`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      questionText
      correctAnswer
    }
  }
`;

const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

const GET_QUESTIONS = gql`
  query GetQuestions {
    getQuestions {
      id
      questionText
      correctAnswer
    }
  }
`;

export default function DeleteQuestionPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_QUESTION, {
    variables: { id },
    skip: !id,
  });

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    update(cache) {
      const existingQuestions = cache.readQuery({ query: GET_QUESTIONS });

      const newQuestions = existingQuestions.getQuestions.filter(
        (question: { id: string }) => question.id !== id,
      );

      cache.writeQuery({
        query: GET_QUESTIONS,
        data: { getQuestions: newQuestions },
      });
    },
    onCompleted: () => {
      router.push("/questions"); // Redirect to the questions page after deletion
    },
  });

  const handleDelete = async () => {
    await deleteQuestion({ variables: { id } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Delete Question</h1>
      <p>Are you sure you want to delete this question?</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">
          {data.getQuestion.questionText}
        </h2>
        <p className="text-gray-600">
          Correct Answer: {data.getQuestion.correctAnswer}
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
        >
          Confirm Delete
        </button>
        <button
          onClick={() => router.push("/questions")}
          className="ml-4 bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
