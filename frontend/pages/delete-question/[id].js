// pages/delete-question/[id].js
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_QUESTION = gql`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      questionText
    }
  }
`;

const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

export default function DeleteQuestionPage() {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the dynamic URL

  const { loading, error, data } = useQuery(GET_QUESTION, {
    variables: { id },
    skip: !id,
  });

  const [deleteQuestion] = useMutation(DELETE_QUESTION);

  const handleDelete = async () => {
    await deleteQuestion({ variables: { id } });
    router.push("/questions"); // Redirect after delete
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Delete Question</h1>
      <p>Are you sure you want to delete this question?</p>
      <div className="mt-4">
        <p className="text-xl">{data.getQuestion.questionText}</p>
      </div>
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Confirm Delete
      </button>
    </div>
  );
}
