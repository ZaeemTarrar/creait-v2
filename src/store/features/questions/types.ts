export interface Phase {
  id: number;
  name: string;
  primary_questions: PrimaryQuestion[];
}

export interface PrimaryQuestion {
  id: number;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
}

export type QuestionType = "radio" | "checkbox" | "dropdown" | "textarea" | "text";

export interface QuestionOption {
  value: string | number;
  followup_questions?: number[];
  exclude_followups?: number[];
}

export interface FollowupQuestion {
  id: number;
  section: string;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
}

export interface SurveyData {
  phases: Phase[];
  followup_questions: FollowupQuestion[];
}

export interface SelectedOption {
  questionId: number;
  selectedValues: string[];
}

export interface PhaseFollowups {
  phaseId: number;
  followupQuestions: FollowupQuestion[];
}
