export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: number;
}

export interface UserSession {
  username: string;
  score: number;
  totalQuestions: number;
  quizTitle: string;
  completedAt: string;
}

export interface AppConfig {
  appName: string;
}
