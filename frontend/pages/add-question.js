// pages/add-question.js
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addQuestion({ variables: { questionText, choices, correctAnswer } });
    setQuestionText("");
    setChoices([""]);
    setCorrectAnswer("");
  };

  const addChoice = () => setChoices([...choices, ""]);
  const updateChoice = (index, value) => {
    const updatedChoices = choices.slice();
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Question Text</label>
        <input
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
      <div>
        <label>Choices</label>
        {choices.map((choice, index) => (
          <input
            key={index}
            value={choice}
            onChange={(e) => updateChoice(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={addChoice}>
          Add Choice
        </button>
      </div>
      <div>
        <label>Correct Answer</label>
        <input
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
