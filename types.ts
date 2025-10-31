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
  'الهندسة': 51,
  'إدارة الأعمال والتسويق': 103,
  'الفنون والتصميم': 154,
  'التعليم والتدريب': 206,
  'القانون والمحاماة': 257,
  'السياحة والفندقة': 309,
};

export type CareerPath = keyof typeof CAREER_PATHS;