import { createSlice } from "@reduxjs/toolkit";
import questionsData from "./../../../static/json/questions.json";
import type { SurveyData } from "./types";

export interface QuestionsState {
  survey: SurveyData;
}

const initialState: QuestionsState = {
  survey: questionsData as unknown as SurveyData,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
});

export default counterSlice.reducer;
