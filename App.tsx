
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, type Question, type Answer, type CareerResult, CAREER_PATHS, CareerPath } from './types';
import { getQuestions, analyzeAnswers } from './services/geminiService';
import QuestionCard from './components/QuestionCard';
import Compass from './components/Compass';
import ResultsCard from './components/ResultsCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<CareerResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetAngle, setTargetAngle] = useState<number>(0);

  const handleStartQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGameState(GameState.Playing); // Change state to show spinner within the main layout
    try {
      const fetchedQuestions = await getQuestions();
      if (fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setResult(null);
      } else {
        throw new Error("لم نتمكن من تحميل الأسئلة. حاول مرة أخرى.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
      setGameState(GameState.Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    if (questions[currentQuestionIndex]) {
        setAnswers(prev => [...prev, { question: questions[currentQuestionIndex].question, answer }]);
    }
    setCurrentQuestionIndex(prev => prev + 1);
  }, [currentQuestionIndex, questions]);

  const handleRestart = () => {
    setGameState(GameState.Start);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setError(null);
    setTargetAngle(0);
  };
  
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex === questions.length) {
      const performAnalysis = async () => {
        setGameState(GameState.Analyzing);
        setError(null);
        try {
          const careerResult = await analyzeAnswers(answers);
          const angle = CAREER_PATHS[careerResult.careerPath as CareerPath] ?? Math.floor(Math.random() * 360);
          setTargetAngle(angle);
          setResult(careerResult);
          // Wait for compass animation to be appreciated
          setTimeout(() => {
            setGameState(GameState.Result);
          }, 3500);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحليل إجاباتك.');
          setGameState(GameState.Error);
        }
      };
      performAnalysis();
    }
  }, [currentQuestionIndex, questions, answers]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Start:
        return (
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 text-cyan-300 drop-shadow-[0_2px_2px_rgba(0,255,255,0.3)]">بوصلة الوظايف</h1>
            <p className="text-slate-400 text-sm mb-12">عمل بواسطة خلود حياصات</p>
            <button
              onClick={handleStartQuiz}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105 duration-300 shadow-lg shadow-cyan-500/50"
            >
              ابدأ الاختبار
            </button>
          </div>
        );
      case GameState.Playing:
        if (isLoading) {
            return <Spinner />;
        }
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
          const progress = ((currentQuestionIndex) / questions.length) * 100;
          return (
            <div className="w-full max-w-3xl mx-auto animate-fade-in">
                <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-6">
                    <div className="bg-cyan-400 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                />
            </div>
          );
        }
        return null;
      case GameState.Analyzing:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold mt-8 text-cyan-300 animate-pulse">جاري تحليل إجاباتك...</h2>
            <p className="text-gray-400 mt-2">تقوم البوصلة بالمعايرة لتحديد وجهتك.</p>
          </div>
        );
      case GameState.Result:
        return result && <ResultsCard result={result} onRestart={handleRestart} />;
      case GameState.Error:
        return (
            <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg animate-fade-in">
                <h2 className="text-3xl font-bold text-red-400 mb-4">حدث خطأ</h2>
                <p className="text-red-300 mb-6">{error}</p>
                <button
                    onClick={handleRestart}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                >
                    حاول مرة أخرى
                </button>
            </div>
        );
    }
  };
  
  const getCompassStatus = () => {
    if (gameState === GameState.Analyzing || (gameState === GameState.Result && !result) ) return 'analyzing';
    if (gameState === GameState.Result && result) return 'result';
    return 'idle';
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative">
        <div className="mb-8 mt-8">
            <Compass status={getCompassStatus()} targetAngle={targetAngle} />
        </div>
        <div className="w-full max-w-3xl">
           {renderContent()}
        </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default App;
