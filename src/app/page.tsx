"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const quizzes = [
    { id: "evaluacion-diagnostica", name: "Evaluación Diagnóstica" },
    { id: "quiz-ingenieria-de-requerimientos", name: "Ingeniería de Requerimientos" },
    { id: "quiz-de-diseno", name: "Diseño de Software" },
    { id: "quiz-de-desarrollo", name: "Quiz de Desarrollo de Software" },
    { id: "quiz-gestion-de-proyectos", name: "Quiz de Gestión de Proyectos" },
  ];

  const handleClose = () => {
    setIsVisible(false);
  };

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
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-12 rounded-lg w-1/2 max-w-4xl text-left">
            <h2 className="font-bold text-2xl mb-6 text-black">¡Anuncio Importante!</h2>
            <p className="text-black mb-4">
              ¡Bienvenid@ a la aplicación! Debido a que Canvas no permite visualizar las respuestas correctas, muchos de los quizzes están incompletos. Te agradecería mucho si pudieras ayudarme a identificar los quizzes y preguntas que faltan por completar. Puedes encontrar esta información en el archivo README.md del proyecto en GitHub. 
            </p>
            <p className="text-black mb-4">
              Si prefieres, puedes enviarme los detalles a través de WhatsApp o hacer un push al repositorio con las correcciones. 
              Tambien te invito a contribuir con tus propias preguntas o quizzes.
            </p>
            <p className="text-black mb-4">
              Hasta ahora, los siguientes quizzes están completamente terminados:
            </p>
            <ul className="list-disc pl-5 text-black">
              <li>Quiz de Desarrollo de Software</li>
            </ul>
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
