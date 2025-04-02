"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number[];  // Correct answers stored in an array
  image?: string | null;
  explanation?: string;  // Added explanation field
}

export default function QuizPage() {
  const { quiz } = useParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState<{ title: string; questions: QuizQuestion[] } | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({}); // Store multiple selected answers
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (quiz) {
      import(`@/data/${quiz}.json`)
        .then((data) => setQuizData(data))
        .catch((err) => console.error("Error loading quiz:", err));
    }
  }, [quiz]);

  const handleAnswer = (optionIndex: number) => {
    if (!submitted) {
      setAnswers((prev) => {
        const selectedAnswers = prev[currentQuestion] || [];
        
        // Check if the question expects only one answer
        const isSingleAnswerQuestion = !Array.isArray(question.correct); // Single correct answer means it's not an array
        
        if (isSingleAnswerQuestion) {
          // If it's a single answer question, clear the selection before adding the new one
          return { ...prev, [currentQuestion]: [optionIndex] }; // Only one answer can be selected
        } else {
          // If it's a multi-answer question, toggle the selection
          if (selectedAnswers.includes(optionIndex)) {
            // Deselect if already selected
            return { ...prev, [currentQuestion]: selectedAnswers.filter((item) => item !== optionIndex) };
          } else {
            // Select the answer
            return { ...prev, [currentQuestion]: [...selectedAnswers, optionIndex] };
          }
        }
      });
    }
  };  

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const goToNextQuestion = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSubmitted(false);
    } else {
      router.push(`/quiz/${quiz}/result?score=${calculateScore()}&total=${quizData?.questions.length}`);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSubmitted(false);
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    return quizData.questions.reduce((score, q, index) => {
      // Ensure correct is always an array
      const correctAnswers = Array.isArray(q.correct) ? q.correct : [q.correct];

      // Get selected answers for the current question
      const selectedAnswers = answers[index] || [];
      
      // Check if the selected answers are the same as correct answers
      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every((answer) => correctAnswers.includes(answer)) &&
        correctAnswers.every((answer) => selectedAnswers.includes(answer));

      return isCorrect ? score + 1 : score;
    }, 0);
  };

  if (!quizData) return <p className="text-center text-gray-500">Cargando...</p>;

  const question = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen p-6 bg-black flex flex-col items-center">
        <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
      >
        ← Volver
      </button>
      <h1 className="text-2xl font-bold mb-4 text-white">{quizData.title} - {"Pregunta " + (currentQuestion + 1)} de {quizData?.questions.length}</h1>
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md text-black">
        <p className="font-semibold">{question.question}</p>

        {question.image && (
          <Image
            src={question.image}
            alt="Question Image"
            width={500} // Adjust width as needed
            height={300} // Adjust height as needed
            className="w-full h-auto mb-4"
          />
        )}

        {question.options.map((option, i) => {
            const isSelected = answers[currentQuestion]?.includes(i); // Check if the option is selected
            const isCorrect = Array.isArray(question.correct) ? question.correct.includes(i) : question.correct === i; // Ensure correct answers are handled properly
            const isWrong = !isCorrect && isSelected; // Determine if it's a wrong answer
            let buttonClass = "block w-full p-2 my-1 border rounded-md ";


            if (submitted) {
                if (isCorrect && isSelected) {
                buttonClass += " bg-green-300 border-blue-600 border-4"; // Correct answer
                } else if (isWrong && isSelected) {
                buttonClass += " bg-red-300 border-blue-600 border-4"; // Incorrect answer
                } else if (isCorrect) {
                buttonClass += " bg-green-300 border-green-600"; // Correct answer
                } else if (isWrong) {
                buttonClass += " bg-red-300 border-red-600"; // Incorrect answer
                } else {
                buttonClass += " bg-white"; // Unselected and incorrect answer
                }
            } else {
                buttonClass += isSelected ? " bg-blue-300 border-blue-600" : " bg-white"; // Highlight selected answers
            }

            return (
                <button key={i} className={buttonClass} onClick={() => handleAnswer(i)}>
                {option}
                </button>
            );
            })}

        {/* Explanation section - only shows after submission if explanation exists */}
        {submitted && question.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-semibold text-blue-800">Explicación:</p>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between w-full max-w-md">
        <button
          onClick={goToPreviousQuestion}
          className={`px-4 py-2 rounded-md bg-gray-500 text-white ${
            currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
          disabled={currentQuestion === 0}
        >
          Atrás
        </button>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Comprobar respuesta
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            {currentQuestion < quizData.questions.length - 1 ? "Siguiente" : "Finalizar"}
          </button>
        )}
      </div>
    </div>
  );
}