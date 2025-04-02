"use client";

import Link from "next/link";
import React, {useEffect, useState} from "react";

export default function Home() {
  const quizzes = [
    { id: "evaluacion-diagnostica", name: "Evaluación Diagnóstica" },
    { id: "quiz-ingenieria-de-requerimientos", name: "Quiz de Ingeniería de Requerimientos" },
    { id: "quiz-de-diseno", name: "Quiz de Diseño de Software" },
    { id: "quiz-de-desarrollo", name: "Quiz de Desarrollo de Software" },
    { id: "quiz-gestion-de-proyectos", name: "Quiz de Gestión de Proyectos" },
    { id: "extra-software-engineering", name: "Extra - Software Engineering" },
  ];
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);

  useEffect(() => {
    const visited = JSON.parse(localStorage.getItem("visited") || "false") || false;
    setIsFirstVisit(!visited);
  }, []);

  const handleClose = () => {
    localStorage.setItem("visited", JSON.stringify(true));
    setIsFirstVisit(false);
  };

  if (isFirstVisit === null) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen p-6 bg-black flex flex-col items-center relative">
      {/* Results Button at the Top Right */}
      <Link 
        href="/history" 
        className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        Ver Historial de Resultados
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-white">Selecciona un Quiz</h1>
      <div className="grid grid-cols-1 gap-4">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition w-64">
              {quiz.name}
            </button>
          </Link>
        ))}
      </div>
      
      {/* Formatted paragraph with link */}
      <div className="mt-8 max-w-md text-center">
        <p className="text-gray-300 mb-4">
          También puedes visitar la siguiente página para más quizzes:
        </p>
        <a 
          href="https://www.sanfoundry.com/software-engineering-questions-answers/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition"
        >
          https://www.sanfoundry.com/software-engineering-questions-answers/
        </a>
      </div>
      {isFirstVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-12 rounded-lg w-1/2 max-w-4xl text-left">
            <h2 className="font-bold text-2xl mb-6 text-black">¡Anuncio Importante!</h2>
            <p className="text-black mb-4">
              ¡Bienvenid@ a la aplicación! Aquí podrás practicar para el examen CENEVAL.
              <br />
            </p>
            <p className="text-black mb-4">
              ¡Todos los quizzes estan listos con las respuestas correctas! (*En teoría*)
            </p>
            <p className="text-black mb-4">
              Si crees que alguna respuesta es incorrecta o algun otro problema hazmelo saber por favor.
              <br />
            </p>
            <strong className="text-black mb-4">
              Esta app no esta pensada para ser usada en mobile, por favor usa una computadora.
            </strong>
            <br />
            <strong className="text-black mb-4 pr-6">¡Buena suerte en tu preparación!</strong>
            <button 
              onClick={handleClose}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
