"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_QUESTION = gql`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      questionText
      choices
      correctAnswer
      categories
    }
  }
`;

const UPDATE_QUESTION = gql`
  mutation UpdateQuestion(
    $id: ID!
    $questionText: String!
    $choices: [String!]!
    $correctAnswer: String!
    $categories: [String!]!
  ) {
    updateQuestion(
      id: $id
      questionText: $questionText
      choices: $choices
      correctAnswer: $correctAnswer
      categories: $categories
    ) {
      id
      questionText
      correctAnswer
      categories
    }
  }
`;

export default function UpdateQuestionPage() {
  const { id } = useParams();
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_QUESTION, {
    variables: { id },
    skip: !id,
  });

  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    if (data) {
      setQuestionText(data.getQuestion.questionText);
      setChoices(data.getQuestion.choices);
      setCorrectAnswer(data.getQuestion.correctAnswer);
      setCategories(data.getQuestion.categories.join(", ")); // Pre-fill categories as comma-separated string
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const categoriesArray = categories.split(",").map((cat) => cat.trim());

    await updateQuestion({
      variables: {
        id,
        questionText,
        choices,
        correctAnswer,
        categories: categoriesArray,
      },
    });

    router.push("/questions");
  };

  const addChoice = () => setChoices([...choices, ""]);
  const updateChoice = (index: number, value: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Update Question</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block font-semibold">Question Text:</label>
          <input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            placeholder="Enter the question text"
            required
          />
        </div>

        {/* Choices */}
        <div>
          <label className="block font-semibold">Choices:</label>
          {choices.map((choice, index) => (
            <input
              key={index}
              value={choice}
              onChange={(e) => updateChoice(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2 bg-white text-black dark:bg-gray-800 dark:text-white"
              placeholder={`Choice ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={addChoice}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Another Choice
          </button>
        </div>

        {/* Correct Answer */}
        <div>
          <label className="block font-semibold">Correct Answer:</label>
          <input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            placeholder="Enter the correct answer"
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block font-semibold">
            Categories (comma-separated):
          </label>
          <input
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            placeholder="Enter categories, e.g. History, Geography"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Update Question
        </button>
      </form>
    </div>
  );
}
