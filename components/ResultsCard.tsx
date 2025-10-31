import React from 'react';
import type { CareerResult } from '../types';

interface ResultsCardProps {
  result: CareerResult;
  onRestart: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, onRestart }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-3xl mx-auto mt-8 border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-lg font-bold mb-1 text-cyan-300">بوصلتك تشير إلى:</h2>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">{result.careerPath}</h1>
      <p className="text-lg text-gray-300 mb-8 leading-relaxed">
        {result.description}
      </p>
      <button
        onClick={onRestart}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105 duration-300 shadow-lg shadow-cyan-500/50"
      >
        أعد الاختبار
      </button>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultsCard;