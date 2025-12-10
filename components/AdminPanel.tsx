import React, { useState, useRef } from 'react';
import { Upload, Save, Trash2, ArrowLeft, Lock, User, Key, LogOut } from 'lucide-react';
import { Button } from './Button';
import { Quiz, AppConfig } from '../types';

interface AdminPanelProps {
  appName: string;
  quizzes: Quiz[];
  onUpdateConfig: (config: AppConfig) => void;
  onAddQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (id: string) => void;
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  appName,
  quizzes,
  onUpdateConfig,
  onAddQuiz,
  onDeleteQuiz,
  onBack
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [editingName, setEditingName] = useState(appName);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Admin@123') {
      setIsAuthenticated(true);
      setAuthError('');
      // Sync local editing state with current prop when logging in
      setEditingName(appName);
    } else {
      setAuthError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleSaveConfig = () => {
    if (!editingName.trim()) {
      setError("App Name cannot be empty");
      return;
    }
    onUpdateConfig({ appName: editingName });
    alert("App name updated!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Basic validation
        if (!json.title || !Array.isArray(json.questions)) {
          throw new Error("Invalid JSON structure. Must have 'title' and 'questions' array.");
        }

        // Generate IDs if missing
        const newQuiz: Quiz = {
          id: `quiz-${Date.now()}`,
          title: json.title,
          createdAt: Date.now(),
          questions: json.questions.map((q: any, idx: number) => ({
            id: q.id || `q-${Date.now()}-${idx}`,
            text: q.question || q.text, // support both keys for flexibility
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation || "No explanation provided."
          }))
        };

        // Validate Questions
        const isValidQuestions = newQuiz.questions.every(q => 
          q.text && Array.isArray(q.options) && typeof q.correctIndex === 'number'
        );

        if (!isValidQuestions) {
          throw new Error("Some questions are missing required fields (text, options, correctIndex).");
        }

        onAddQuiz(newQuiz);
        setError(null);
        alert(`Quiz "${newQuiz.title}" added successfully!`);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      } catch (err: any) {
        setError(err.message || "Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // --- Render Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto w-full pt-6 md:pt-12">
         <div className="mb-6">
            <Button variant="secondary" onClick={onBack} className="!px-3 mb-4">
              <ArrowLeft size={20} /> Back to Home
            </Button>
         </div>
         <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                <p className="text-gray-500 text-sm mt-2">Enter credentials to access dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Username</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter username"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter password"
                        />
                    </div>
                </div>

                {authError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
                        {authError}
                    </div>
                )}

                <Button type="submit" fullWidth className="mt-4">
                    Login
                </Button>
            </form>
         </div>
      </div>
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={onBack} className="!px-3">
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid gap-6">
        {/* App Configuration Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">General Settings</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <Button onClick={handleSaveConfig} className="mb-[1px]">
              <Save size={18} /> Save
            </Button>
          </div>
        </div>

        {/* Upload Quiz Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Quiz</h3>
          
          <div className="border-2 border-dashed border-indigo-100 rounded-xl p-8 text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <span className="text-indigo-600 font-medium">Click to upload JSON file</span>
              <p className="text-sm text-gray-500 mt-1">Format: {`{ "title": "...", "questions": [...] }`}</p>
            </label>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Manage Quizzes Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Manage Quizzes ({quizzes.length})</h3>
          <div className="space-y-3">
            {quizzes.length === 0 ? (
              <p className="text-gray-400 italic">No quizzes available.</p>
            ) : (
              quizzes.map(quiz => (
                <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                    <span className="text-xs text-gray-500">{quiz.questions.length} questions</span>
                  </div>
                  <button 
                    onClick={() => onDeleteQuiz(quiz.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Quiz"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};