import {
  saveIdea,
  saveAnswer,
  setCurrentPhase,
  setCurrentQuestionIndex,
  setPhaseCompletion,
  setShowResults,
  resetSurvey,
  goToNextPhase,
  goToPreviousPhase,
} from "./reducer";

export const saveIdeaAction = (text: string) => saveIdea(text);
export const saveAnswerAction = (
  questionId: number,
  value: string | string[] | number,
  phaseId: number
) => saveAnswer({ questionId, value, phaseId });
export const setCurrentPhaseAction = (phaseId: number) => setCurrentPhase(phaseId);
export const setCurrentQuestionIndexAction = (index: number) => setCurrentQuestionIndex(index);
export const setPhaseCompletionAction = (phaseId: number, completed: boolean) =>
  setPhaseCompletion({ phaseId, completed });
export const setShowResultsAction = (show: boolean) => setShowResults(show);
export const resetSurveyAction = () => resetSurvey();
export const goToNextPhaseAction = () => goToNextPhase();
export const goToPreviousPhaseAction = () => goToPreviousPhase();
