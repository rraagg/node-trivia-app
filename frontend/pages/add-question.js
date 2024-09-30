// pages/add-question.js
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const ADD_QUESTION = gql`
  mutation AddQuestion(
    $questionText: String!
    $choices: [String!]!
    $correctAnswer: String!
  ) {
    addQuestion(
      questionText: $questionText
      choices: $choices
      correctAnswer: $correctAnswer
    ) {
      id
      questionText
      choices
      correctAnswer
    }
  }
`;

export default function AddQuestionPage() {
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [addQuestion] = useMutation(ADD_QUESTION);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addQuestion({
      variables: { questionText, choices, correctAnswer },
    });
    router.push("/questions"); // Redirect to questions page after adding
  };

  const addChoice = () => setChoices([...choices, ""]);
  const updateChoice = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Add New Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Question:</label>
          <input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter the question text"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Choices:</label>
          {choices.map((choice, index) => (
            <input
              key={index}
              value={choice}
              onChange={(e) => updateChoice(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
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

        <div>
          <label className="block font-semibold">Correct Answer:</label>
          <input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter the correct answer"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
