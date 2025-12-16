// Updated types.ts
export type ConditionOperator =
  | "includes"
  | "equals"
  | "not-equals"
  | "greater-than"
  | "less-than"
  | "between";

export interface Condition {
  questionId: number;
  operator: ConditionOperator;
  value: string | number | string[] | { min: number; max: number };
}

export interface QuestionOption {
  value: string;
  label: string;
}

export type QuestionType = "radio" | "checkbox" | "dropdown" | "textarea" | "text" | "range";

export interface RangeConfig {
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
  conditions: Condition[];
  rangeConfig?: RangeConfig;
}

export interface Phase {
  id: number;
  name: string;
  questions: Question[];
}

export interface SurveyData {
  phases: Phase[];
}

export interface UserAnswer {
  questionId: number;
  value: string | string[] | number;
  phaseId: number;
  timestamp: string;
}

export interface SurveyState {
  currentPhase: number;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  phaseCompletion: Record<number, boolean>;
  showResults: boolean;
}

export interface PhaseCompletion {
  phaseId: number;
  completed: boolean;
  completionPercentage: number;
}
