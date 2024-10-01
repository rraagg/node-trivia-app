"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

const ADD_QUESTION = gql`
  mutation AddQuestion(
    $questionText: String!
    $choices: [String!]!
    $correctAnswer: String!
    $categories: [String!]!
  ) {
    addQuestion(
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

export default function AddQuestionPage() {
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [categories, setCategories] = useState("");
  const [addQuestion] = useMutation(ADD_QUESTION, {
    update(cache, { data: { addQuestion } }) {
      const existingQuestions = cache.readQuery({ query: GET_QUESTIONS });

      const newQuestions = [...existingQuestions.getQuestions, addQuestion];

      cache.writeQuery({
        query: GET_QUESTIONS,
        data: { getQuestions: newQuestions },
      });
    },
    onCompleted: () => {
      router.push("/questions");
    },
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Split the categories by commas and trim any extra whitespace
    const categoriesArray = categories.split(",").map((cat) => cat.trim());

    await addQuestion({
      variables: {
        questionText,
        choices,
        correctAnswer,
        categories: categoriesArray,
      },
    });
  };

  const addChoice = () => setChoices([...choices, ""]);
  const updateChoice = (index: number, value: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add New Question</h1>

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
          Submit
        </button>
      </form>
    </div>
  );
}
