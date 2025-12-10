import React, { useState, useEffect } from 'react';
import { Settings, Play, Trophy, RotateCcw, User, Info } from 'lucide-react';
import { Button } from './components/Button';
import { AdminPanel } from './components/AdminPanel';
import { QuizPlayer } from './components/QuizPlayer';
import { Quiz, UserSession, AppConfig } from './types';
import { DEFAULT_QUIZ, DEFAULT_APP_NAME } from './constants';

type ViewState = 'welcome' | 'quiz' | 'result' | 'admin';

const App: React.FC = () => {
  // --- Persisted State ---
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('quiz-app-config');
    return saved ? JSON.parse(saved) : { appName: DEFAULT_APP_NAME };
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('quiz-app-data');
    return saved ? JSON.parse(saved) : [DEFAULT_QUIZ];
  });

  const [history, setHistory] = useState<UserSession[]>(() => {
    const saved = localStorage.getItem('quiz-app-history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Session State ---
  const [view, setView] = useState<ViewState>('welcome');
  const [currentUser, setCurrentUser] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [lastSession, setLastSession] = useState<UserSession | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('quiz-app-config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('quiz-app-data', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quiz-app-history', JSON.stringify(history));
  }, [history]);

  // --- Handlers ---
  const handleStartQuiz = (quiz: Quiz) => {
    if (!currentUser.trim()) {
      alert("Please enter your name first!");
      return;
    }
    setSelectedQuiz(quiz);
    setView('quiz');
  };

  const handleQuizFinish = (session: UserSession) => {
    setLastSession(session);
    setHistory(prev => [session, ...prev]);
    setView('result');
  };

  const handleAddQuiz = (quiz: Quiz) => {
    setQuizzes(prev => [...prev, quiz]);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
    }
  };

  // --- Render Views ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto p-4 z-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 pb-2">
          {config.appName}
        </h1>
        <p className="text-gray-500 text-lg">Test your knowledge and challenge yourself.</p>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-gray-100">
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wide">Enter Your Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="John Doe"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-lg font-medium text-gray-800"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">Select a Quiz</h3>
          {quizzes.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No quizzes available. Ask admin to upload one.</p>
            </div>
          ) : (
            <div className="grid gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {quizzes.map(quiz => (
                <button
                  key={quiz.id}
                  onClick={() => handleStartQuiz(quiz)}
                  className="group flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-indigo-500 hover:shadow-md rounded-xl transition-all text-left"
                >
                  <div>
                    <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{quiz.title}</h4>
                    <span className="text-xs text-gray-400 font-medium">{quiz.questions.length} Questions</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Play size={20} className="ml-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => setView('admin')}
          className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Settings size={16} /> Admin Panel
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!lastSession) return null;
    const percentage = Math.round((lastSession.score / lastSession.totalQuestions) * 100);
    let message = "Keep Practicing!";
    let color = "text-yellow-600";
    
    if (percentage >= 90) { message = "Outstanding!"; color = "text-green-600"; }
    else if (percentage >= 70) { message = "Great Job!"; color = "text-indigo-600"; }
    else if (percentage >= 50) { message = "Good Effort!"; color = "text-blue-600"; }

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full animate-fade-in z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="mx-auto w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Trophy className="text-yellow-500 drop-shadow-sm" size={48} />
          </div>

          <h2 className={`text-3xl font-extrabold mb-2 ${color}`}>{message}</h2>
          <p className="text-gray-500 mb-8">{lastSession.username}, here is your result for <br/><span className="font-semibold text-gray-800">{lastSession.quizTitle}</span></p>

          <div className="flex justify-center items-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">{lastSession.score}</div>
              <div className="text-xs uppercase tracking-wide text-gray-400 font-bold mt-1">Correct</div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">{lastSession.totalQuestions}</div>
              <div className="text-xs uppercase tracking-wide text-gray-400 font-bold mt-1">Total</div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">{percentage}%</div>
              <div className="text-xs uppercase tracking-wide text-gray-400 font-bold mt-1">Score</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => setView('welcome')} variant="secondary" fullWidth className="gap-2">
              <RotateCcw size={18} /> Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-6 flex flex-col relative">
      {/* Watermark */}
      <div className="fixed bottom-0 right-0 p-4 md:p-6 text-gray-900 opacity-[0.08] pointer-events-none select-none z-0 text-right">
        <div className="text-lg md:text-xl font-black uppercase tracking-widest leading-none">Created By</div>
        <div className="text-sm md:text-base font-medium font-mono">Manish Matwa @expert.py</div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center relative z-10">
        {view === 'welcome' && renderWelcome()}
        
        {view === 'quiz' && selectedQuiz && (
          <div className="w-full mt-8 md:mt-12">
            <QuizPlayer 
              quiz={selectedQuiz}
              username={currentUser}
              onFinish={handleQuizFinish}
              onExit={() => setView('welcome')}
            />
          </div>
        )}

        {view === 'result' && renderResult()}

        {view === 'admin' && (
          <div className="w-full mt-8">
            <AdminPanel 
              appName={config.appName}
              quizzes={quizzes}
              onUpdateConfig={(newConfig) => setConfig(prev => ({ ...prev, ...newConfig }))}
              onAddQuiz={handleAddQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              onBack={() => setView('welcome')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm relative z-10">
        <p>&copy; {new Date().getFullYear()} {config.appName}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;