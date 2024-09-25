// pages/questions.js
import { gql, useQuery } from "@apollo/client";

const GET_QUESTIONS = gql`
  query GetQuestions {
    getQuestions {
      id
      questionText
      choices
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
      <h1>Questions List</h1>
      <ul>
        {data.getQuestions.map((question) => (
          <li key={question.id}>
            {question.questionText} - Correct Answer: {question.correctAnswer}
          </li>
        ))}
      </ul>
    </div>
  );
}
