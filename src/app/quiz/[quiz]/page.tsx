"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number[];  // Correct answers stored in an array
  image?: string | null;
  explanation?: string;
}

interface ShuffledOption {
  originalIndex: number;
  text: string;
}

export default function QuizPage() {
  const { quiz } = useParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState<{ title: string; questions: QuizQuestion[] } | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[][]>([]);

  useEffect(() => {
    if (quiz) {
      import(`@/data/${quiz}.json`)
        .then((data) => {
          setQuizData(data);
          // Initialize shuffled options for all questions
          const shuffled: ShuffledOption[][] = data.questions.map((question: QuizQuestion) => 
            shuffleOptions(question.options)
          );
          setShuffledOptions(shuffled);
        })
        .catch((err) => console.error("Error loading quiz:", err));
    }
  }, [quiz]);

  // Fisher-Yates shuffle algorithm
  const shuffleOptions = (options: string[]): ShuffledOption[] => {
    const shuffled = options.map((text, index) => ({
      originalIndex: index,
      text
    }));
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  const handleAnswer = (originalIndex: number) => {
    if (!submitted) {
      setAnswers((prev) => {
        const selectedAnswers = prev[currentQuestion] || [];
        const isSingleAnswerQuestion = !Array.isArray(question.correct);
        
        if (isSingleAnswerQuestion) {
          return { ...prev, [currentQuestion]: [originalIndex] };
        } else {
          if (selectedAnswers.includes(originalIndex)) {
            return { ...prev, [currentQuestion]: selectedAnswers.filter((item) => item !== originalIndex) };
          } else {
            return { ...prev, [currentQuestion]: [...selectedAnswers, originalIndex] };
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
      const correctAnswers = Array.isArray(q.correct) ? q.correct : [q.correct];
      const selectedAnswers = answers[index] || [];
      
      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every((answer) => correctAnswers.includes(answer)) &&
        correctAnswers.every((answer) => selectedAnswers.includes(answer));

      return isCorrect ? score + 1 : score;
    }, 0);
  };

  if (!quizData || shuffledOptions.length === 0) return <p className="text-center text-gray-500">Cargando...</p>;

  const question = quizData.questions[currentQuestion];
  const currentShuffledOptions = shuffledOptions[currentQuestion] || [];

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
            width={500}
            height={300}
            className="w-full h-auto mb-4"
          />
        )}

        {currentShuffledOptions.map((option, i) => {
          const originalIndex = option.originalIndex;
          const isSelected = answers[currentQuestion]?.includes(originalIndex);
          const isCorrect = Array.isArray(question.correct) 
            ? question.correct.includes(originalIndex) 
            : question.correct === originalIndex;
          const isWrong = !isCorrect && isSelected;
          let buttonClass = "block w-full p-2 my-1 border rounded-md ";

          if (submitted) {
            if (isCorrect && isSelected) {
              buttonClass += " bg-green-300 border-blue-600 border-4";
            } else if (isWrong && isSelected) {
              buttonClass += " bg-red-300 border-blue-600 border-4";
            } else if (isCorrect) {
              buttonClass += " bg-green-300 border-green-600";
            } else if (isWrong) {
              buttonClass += " bg-red-300 border-red-600";
            } else {
              buttonClass += " bg-white";
            }
          } else {
            buttonClass += isSelected ? " bg-blue-300 border-blue-600" : " bg-white";
          }

          return (
            <button 
              key={i} 
              className={buttonClass} 
              onClick={() => handleAnswer(originalIndex)}
            >
              {option.text}
            </button>
          );
        })}

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