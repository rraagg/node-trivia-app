"use client";

import { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

// GraphQL query to fetch questions with randomization
const GET_QUESTIONS = gql`
  query GetQuestions($categories: [String!], $numQuestions: Int!) {
    getQuestions(categories: $categories, numQuestions: $numQuestions) {
      id
      questionText
      choices
      correctAnswer
    }
  }
`;

// GraphQL query to fetch all categories
const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories
  }
`;

// Helper function to shuffle an array
function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PlayTriviaPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Fetch questions
  const [
    fetchQuestions,
    { loading: questionsLoading, data: questionsData, error: questionsError },
  ] = useLazyQuery(GET_QUESTIONS);

  // Fetch categories
  const [
    fetchCategories,
    {
      loading: categoriesLoading,
      data: categoriesData,
      error: categoriesError,
    },
  ] = useLazyQuery(GET_CATEGORIES, {
    fetchPolicy: "network-only",
  });

  // Fetch categories on mount
  useEffect(() => {
    console.log("Fetching categories...");
    fetchCategories();
  }, [fetchCategories]);

  // Log the fetched categories or any error
  useEffect(() => {
    if (categoriesData) {
      console.log("Categories data:", categoriesData.getCategories);
    }
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
    }
  }, [categoriesData, categoriesError]);

  // Fetch questions when categories or numQuestions change
  useEffect(() => {
    if (selectedCategories.length > 0 && numQuestions > 0) {
      console.log("Fetching questions with:", {
        selectedCategories,
        numQuestions,
      });
      fetchQuestions({
        variables: { categories: selectedCategories, numQuestions },
      });
    }
  }, [selectedCategories, numQuestions, fetchQuestions]);

  // Log the fetched questions or any error
  useEffect(() => {
    if (questionsData) {
      console.log("Questions data:", questionsData.getQuestions);
      const randomizedQuestions = questionsData.getQuestions.map(
        (question: any) => ({
          ...question,
          choices: shuffleArray(question.choices), // Shuffle answer choices
        }),
      );
      setQuestions(randomizedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
      setShowResults(false);
    }
    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
    }
  }, [questionsData, questionsError]);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // Handle answer selection and score tracking
  const handleAnswerClick = (choice: string) => {
    setSelectedAnswer(choice);
    const correct = choice === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // Handle moving to the next question or showing results
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResults(true);
    }
  };

  // Handle moving to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  if (categoriesLoading) return <p>Loading categories...</p>;
  if (!categoriesData || !categoriesData.getCategories)
    return <p>No categories available</p>;
  if (questionsLoading) return <p>Loading questions...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Play Trivia</h1>

      {/* Category selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categoriesData.getCategories.map((category: string) => (
            <button
              key={category}
              className={`border px-4 py-2 rounded ${selectedCategories.includes(category)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
                }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category} {selectedCategories.includes(category) && "✔️"}
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions Input */}
      <div className="mb-6">
        <label
          htmlFor="numQuestions"
          className="text-xl font-semibold mb-4 block"
        >
          Number of Questions:
        </label>
        <input
          type="number"
          id="numQuestions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="border p-2 rounded w-24 text-black"
          min={1}
        />
      </div>

      {/* Display question */}
      {showResults ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Final Results</h2>
          <p className="text-lg">
            You scored {score} out of {questions.length}!
          </p>
        </div>
      ) : (
        questions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {questions[currentQuestionIndex].questionText}
            </h2>

            {/* Display 4 choices as buttons */}
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestionIndex].choices.map(
                (choice: string, index: number) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                    onClick={() => handleAnswerClick(choice)}
                    disabled={selectedAnswer !== null}
                  >
                    {choice}
                  </button>
                ),
              )}
            </div>

            {/* Show feedback */}
            {selectedAnswer && (
              <div className="mt-4">
                {isCorrect ? (
                  <p className="text-green-500 text-lg font-bold">
                    Correct! The answer is {selectedAnswer}.
                  </p>
                ) : (
                  <p className="text-red-500 text-lg font-bold">
                    Incorrect! The correct answer was{" "}
                    {questions[currentQuestionIndex].correctAnswer}.
                  </p>
                )}
              </div>
            )}

            {/* Previous and Next buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
