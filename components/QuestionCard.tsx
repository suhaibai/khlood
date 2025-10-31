import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFading(false);
  }, [question]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsFading(true);
    setTimeout(() => {
        onAnswer(option);
        setSelected(null);
    }, 400); // Match fade-out duration
  };

  const animationClass = isFading ? 'animate-fade-out' : 'animate-fade-in';

  return (
    <div ref={cardRef} className={`bg-slate-800/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-3xl mx-auto border border-slate-700/50 ${animationClass}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-cyan-300">
        {question.question}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selected === option;
          const buttonClasses = isSelected 
            ? 'bg-cyan-500 text-white border-cyan-400 scale-105 shadow-lg shadow-cyan-500/30'
            : 'bg-slate-700 hover:bg-slate-600 text-gray-200 border-slate-600 hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/20';

          return (
            <button
              key={`${question.question}-${index}`}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`w-full p-4 rounded-lg text-lg text-right font-semibold border-2 transition-all duration-300 ease-in-out disabled:opacity-80 disabled:cursor-wait ${buttonClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes fade-out {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        .animate-fade-out {
          animation: fade-out 0.4s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;