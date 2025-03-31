"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const quizzes = [
    { id: "evaluacion-diagnostica", name: "Evaluación Diagnóstica" },
    { id: "quiz-ingenieria-de-requerimientos", name: "Ingeniería de Requerimientos" },
    { id: "quiz-de-diseno", name: "Diseño de Software" },
    { id: "quiz-de-desarrollo", name: "Quiz de Desarrollo de Software" },
    { id: "quiz-gestion-de-proyectos", name: "Quiz de Gestión de Proyectos" },
  ];

export default function ResultsPage() {
  const [results, setResults] = useState<{ [key: string]: { score: number; total: number; date: string }[] }>({});
  const [openQuiz, setOpenQuiz] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load results from localStorage
    const storedResults: { [key: string]: { score: number; total: number; date: string }[] } = {};
    quizzes.forEach((quiz) => {
      const data = localStorage.getItem(`quiz_results_${quiz.id}`);
      storedResults[quiz.id] = data ? JSON.parse(data) : [];
    });
    setResults(storedResults);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-black text-white flex flex-col items-center relative">
      {/* Back Button at Top Left */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-6">Historial de Resultados</h1>

      <div className="w-full max-w-2xl">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="mb-4 border border-gray-700 rounded-lg overflow-hidden">
            {/* Quiz Header (Collapsible) */}
            <button
              className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 transition flex justify-between items-center"
              onClick={() => setOpenQuiz(openQuiz === quiz.id ? null : quiz.id)}
            >
              <span className="text-lg font-semibold">{quiz.name}</span>
              <span>{openQuiz === quiz.id ? "▲" : "▼"}</span>
            </button>

            {/* Results Table (Collapsible) */}
            {openQuiz === quiz.id && (
              <div className="p-4 bg-gray-900">
                {results[quiz.id].length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 px-4 py-2">Fecha</th>
                        <th className="border border-gray-600 px-4 py-2">Puntaje</th>
                        <th className="border border-gray-600 px-4 py-2">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results[quiz.id].map((res, index) => (
                        <tr key={index} className="text-center bg-gray-800">
                          <td className="border border-gray-600 px-4 py-2">{res.date}</td>
                          <td className="border border-gray-600 px-4 py-2">{res.score} / {res.total}</td>
                          <td className="border border-gray-600 px-4 py-2">{((res.score / res.total) * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-400 text-center">No hay resultados para este quiz.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
