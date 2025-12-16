import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import questionsData from "../../../static/json/questions.json";
import type { SurveyData, SurveyState, UserAnswer } from "./types";

export interface QuestionsState {
  survey: SurveyData;
  idea: string | null;
  surveyState: SurveyState;
}

const initialState: QuestionsState = {
  survey: questionsData as unknown as SurveyData,
  idea: null,
  surveyState: {
    currentPhase: 1,
    currentQuestionIndex: 0,
    userAnswers: [],
    phaseCompletion: {},
    showResults: false,
  },
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    saveIdea: (state, action: PayloadAction<string>) => {
      state.idea = action.payload ? action.payload : null;
    },
    saveAnswer: (
      state,
      action: PayloadAction<{
        questionId: number;
        value: string | string[] | number;
        phaseId: number;
      }>
    ) => {
      const { questionId, value, phaseId } = action.payload;
      const existingIndex = state.surveyState.userAnswers.findIndex(
        (answer) => answer.questionId === questionId && answer.phaseId === phaseId
      );

      const newAnswer: UserAnswer = {
        questionId,
        value,
        phaseId,
        timestamp: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        state.surveyState.userAnswers[existingIndex] = newAnswer;
      } else {
        state.surveyState.userAnswers.push(newAnswer);
      }
    },
    setCurrentPhase: (state, action: PayloadAction<number>) => {
      state.surveyState.currentPhase = action.payload;
      state.surveyState.currentQuestionIndex = 0;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.surveyState.currentQuestionIndex = action.payload;
    },
    setPhaseCompletion: (state, action: PayloadAction<{ phaseId: number; completed: boolean }>) => {
      const { phaseId, completed } = action.payload;
      state.surveyState.phaseCompletion[phaseId] = completed;
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.surveyState.showResults = action.payload;
    },
    resetSurvey: (state) => {
      state.surveyState = {
        currentPhase: 1,
        currentQuestionIndex: 0,
        userAnswers: [],
        phaseCompletion: {},
        showResults: false,
      };
    },
    goToNextPhase: (state) => {
      if (state.surveyState.currentPhase < 4) {
        state.surveyState.currentPhase += 1;
        state.surveyState.currentQuestionIndex = 0;
      }
    },
    goToPreviousPhase: (state) => {
      if (state.surveyState.currentPhase > 1) {
        state.surveyState.currentPhase -= 1;
        state.surveyState.currentQuestionIndex = 0;
      }
    },
  },
});

export const {
  saveIdea,
  saveAnswer,
  setCurrentPhase,
  setCurrentQuestionIndex,
  setPhaseCompletion,
  setShowResults,
  resetSurvey,
  goToNextPhase,
  goToPreviousPhase,
} = questionsSlice.actions;
export default questionsSlice.reducer;
