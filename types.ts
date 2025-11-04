export enum GameState {
  Start,
  Playing,
  Analyzing,
  Result,
  Error,
}

export interface Question {
  question: string;
  options: string[];
}

export interface Answer {
  question: string;
  answer: string;
}

export interface CareerResult {
  careerPath: string;
  description: string;
}

export const CAREER_PATHS = {
  'تكنولوجيا المعلومات': 0,
  'الهندسة': 60,
  'إدارة الأعمال والتسويق': 120,
  'الفنون والتصميم': 180,
  'القانون والمحاماة': 240,
  'السياحة والفندقة': 300,
};

export type CareerPath = keyof typeof CAREER_PATHS;