import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, AlertCircle, Award } from 'lucide-react';
import { Button } from './Button';
import { Quiz, UserSession } from '../types';

interface QuizPlayerProps {
  quiz: Quiz;
  username: string;
  onFinish: (session: UserSession) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, username, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Finish Quiz
      const finalScore = score + (selectedOption === currentQuestion.correctIndex ? 0 : 0); // Score already updated on submit? No wait.
      // Score is updated immediately on submit. We just pass current score state.
      
      onFinish({
        username,
        score: score,
        totalQuestions: quiz.questions.length,
        quizTitle: quiz.title,
        completedAt: new Date().toISOString()
      });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const progress = ((currentIndex) / quiz.questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header / Progress */}
      <div className="mb-6 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Playing as {username}</span>
            <h2 className="text-xl font-bold text-gray-800">{quiz.title}</h2>
         </div>
         <div className="text-right">
            <span className="text-2xl font-bold text-indigo-600">{currentIndex + 1}</span>
            <span className="text-gray-400 font-medium">/{quiz.questions.length}</span>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-6 md:p-10 mb-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0" />
        
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 relative z-10 leading-relaxed">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3 relative z-10">
          {currentQuestion.options.map((option, idx) => {
            let stateClasses = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
            let icon = <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
            
            if (isAnswered) {
              if (idx === currentQuestion.correctIndex) {
                stateClasses = "border-green-500 bg-green-50 ring-1 ring-green-500";
                icon = <CheckCircle className="text-green-500" size={20} />;
              } else if (idx === selectedOption && idx !== currentQuestion.correctIndex) {
                stateClasses = "border-red-500 bg-red-50 ring-1 ring-red-500";
                icon = <XCircle className="text-red-500" size={20} />;
              } else {
                stateClasses = "border-gray-100 opacity-60";
              }
            } else if (selectedOption === idx) {
              stateClasses = "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600";
              icon = <div className="w-5 h-5 rounded-full border-[6px] border-indigo-600" />;
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${stateClasses}`}
              >
                <div className="flex-shrink-0">
                  {icon}
                </div>
                <span className={`font-medium ${isAnswered && idx === currentQuestion.correctIndex ? 'text-green-700' : 'text-gray-700'}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Area */}
        {isAnswered && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl relative z-10 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-blue-800 text-sm mb-1 uppercase">Explanation</h4>
                <p className="text-blue-900 leading-relaxed text-sm md:text-base">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onExit}
          className="text-gray-400 hover:text-gray-600 font-medium px-4 py-2 transition-colors"
        >
          Quit Quiz
        </button>

        {!isAnswered ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedOption === null}
            className="w-32"
          >
            Submit
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="w-32 animate-bounce-short"
          >
            {isLastQuestion ? "Finish" : "Next"} <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};