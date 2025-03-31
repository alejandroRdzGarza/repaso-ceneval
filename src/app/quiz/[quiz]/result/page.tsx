"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizResult() {
  const searchParams = useSearchParams();
  const { quiz } = useParams();
  const router = useRouter();
  const [saved, setSaved] = useState(false); // Prevent multiple saves

  const score = searchParams.get("score");
  const total = searchParams.get("total");

  useEffect(() => {
    if (!saved && score && total) {
      const newResult = {
        score: Number(score),
        total: Number(total),
        date: new Date().toLocaleString(),
      };

      // Retrieve existing results
      const pastResults = JSON.parse(localStorage.getItem(`quiz_results_${quiz}`) || "[]");

      // Prevent adding duplicate results (check if the exact score & date already exists)
      const isDuplicate = pastResults.some(
        (result: { score: number; total: number; date: string }) =>
          result.score === newResult.score && result.total === newResult.total && result.date === newResult.date
      );

      if (!isDuplicate) {
        const updatedResults = [...pastResults, newResult];
        localStorage.setItem(`quiz_results_${quiz}`, JSON.stringify(updatedResults));
      }

      setSaved(true); // Ensure effect runs only once
    }
  }, [score, total, quiz, saved]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">Resultados del Quiz</h1>
        <p className="text-lg mt-2">
          Tu puntuación: <span className="font-semibold">{score} / {total}</span>
        </p>
        <p className="text-lg mt-1">
          Porcentaje: <span className="font-semibold">{((Number(score) / Number(total)) * 100).toFixed(2)}%</span>
        </p>
        <button
          onClick={() => router.push(`/quiz/${quiz}`)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => router.push(`/`)}
          className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
