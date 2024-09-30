// pages/update-question/[id].js
import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const GET_QUESTION = gql`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      questionText
      choices
      correctAnswer
    }
  }
`;

const UPDATE_QUESTION = gql`
  mutation UpdateQuestion(
    $id: ID!
    $questionText: String!
    $choices: [String!]!
    $correctAnswer: String!
  ) {
    updateQuestion(
      id: $id
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

export default function UpdateQuestionPage() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_QUESTION, {
    variables: { id },
    skip: !id, // Skip query if no ID is available
  });

  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    if (data) {
      setQuestionText(data.getQuestion.questionText);
      setChoices(data.getQuestion.choices);
      setCorrectAnswer(data.getQuestion.correctAnswer);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateQuestion({
      variables: { id, questionText, choices, correctAnswer },
    });
    router.push("/questions"); // Redirect after update
  };

  const addChoice = () => setChoices([...choices, ""]);
  const updateChoice = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Update Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Question:</label>
          <input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
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
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}
