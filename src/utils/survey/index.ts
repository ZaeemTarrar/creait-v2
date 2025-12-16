import type {
  Condition,
  Question,
  UserAnswer,
  SurveyState,
  ConditionOperator,
} from "../../store/features/questions/types";

// Type-safe type guards
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

interface BetweenObject {
  min: number;
  max: number;
}

const isBetweenObject = (value: unknown): value is BetweenObject =>
  typeof value === "object" &&
  value !== null &&
  "min" in value &&
  "max" in value &&
  typeof (value as BetweenObject).min === "number" &&
  typeof (value as BetweenObject).max === "number";

// Helper to safely get condition value based on operator
const getConditionValue = (
  condition: Condition,
  operator: ConditionOperator
): string | number | string[] | BetweenObject => {
  const { value } = condition;

  switch (operator) {
    case "includes":
      if (!isStringArray(value)) {
        console.warn(`Expected string[] for includes operator, got:`, value);
        return [];
      }
      return value;

    case "equals":
    case "not-equals":
      if (!isString(value)) {
        console.warn(`Expected string for ${operator} operator, got:`, value);
        return "";
      }
      return value;

    case "greater-than":
    case "less-than":
      if (!isNumber(value)) {
        console.warn(`Expected number for ${operator} operator, got:`, value);
        return 0;
      }
      return value;

    case "between":
      if (!isBetweenObject(value)) {
        console.warn(`Expected {min, max} object for between operator, got:`, value);
        return { min: 0, max: 0 };
      }
      return value;

    default:
      console.warn(`Unknown operator: ${operator}`);
      return "";
  }
};

// Helper to normalize answer value for comparison
const normalizeAnswer = (answerValue: string | string[] | number): string | string[] | number => {
  if (Array.isArray(answerValue)) {
    return answerValue.map((item) => item.toString());
  }
  if (typeof answerValue === "number") {
    return answerValue;
  }
  return answerValue.toString();
};

export const checkCondition = (
  condition: Condition,
  userAnswers: UserAnswer[],
  currentPhase: number
): boolean => {
  const { questionId, operator } = condition;

  // Find the answer for this question
  const answer = userAnswers.find(
    (ans) => ans.questionId === questionId && ans.phaseId <= currentPhase
  );

  if (!answer) return false;

  const answerValue = normalizeAnswer(answer.value);
  const conditionValue = getConditionValue(condition, operator);

  switch (operator) {
    case "includes": {
      const includesValue = conditionValue as string[];
      if (Array.isArray(answerValue)) {
        return (answerValue as string[]).some((val: string) => includesValue.includes(val));
      }
      return includesValue.includes(answerValue as string);
    }

    case "equals": {
      const equalsValue = conditionValue as string;
      if (Array.isArray(answerValue)) {
        return answerValue.length === 1 && answerValue[0] === equalsValue;
      }
      return answerValue === equalsValue;
    }

    case "not-equals": {
      const notEqualsValue = conditionValue as string;
      if (Array.isArray(answerValue)) {
        return !(answerValue as string[]).some((val: string) => val === notEqualsValue);
      }
      return answerValue !== notEqualsValue;
    }

    case "greater-than": {
      const greaterValue = conditionValue as number;
      const numAnswer =
        typeof answerValue === "number" ? answerValue : parseFloat(answerValue.toString());
      return !isNaN(numAnswer) && numAnswer > greaterValue;
    }

    case "less-than": {
      const lessValue = conditionValue as number;
      const numAnswer =
        typeof answerValue === "number" ? answerValue : parseFloat(answerValue.toString());
      return !isNaN(numAnswer) && numAnswer < lessValue;
    }

    case "between": {
      const betweenValue = conditionValue as BetweenObject;
      const numAnswer =
        typeof answerValue === "number" ? answerValue : parseFloat(answerValue.toString());
      return !isNaN(numAnswer) && numAnswer >= betweenValue.min && numAnswer <= betweenValue.max;
    }

    default:
      return false;
  }
};

export const shouldShowQuestion = (
  question: Question,
  userAnswers: UserAnswer[],
  currentPhase: number
): boolean => {
  // If no conditions, always show
  if (question.conditions.length === 0) return true;

  // Check all conditions (AND logic)
  return question.conditions.every((condition) =>
    checkCondition(condition, userAnswers, currentPhase)
  );
};

export const getVisibleQuestions = (
  questions: Question[],
  userAnswers: UserAnswer[],
  currentPhase: number
): Question[] => {
  return questions.filter((question) => shouldShowQuestion(question, userAnswers, currentPhase));
};

export const getPhaseCompletionPercentage = (
  phaseQuestions: Question[],
  userAnswers: UserAnswer[],
  phaseId: number
): number => {
  const visibleQuestions = getVisibleQuestions(phaseQuestions, userAnswers, phaseId);
  const answeredQuestions = visibleQuestions.filter((question) =>
    userAnswers.some((answer) => answer.questionId === question.id && answer.phaseId === phaseId)
  ).length;

  return visibleQuestions.length > 0
    ? Math.round((answeredQuestions / visibleQuestions.length) * 100)
    : 0;
};

export const getOverallCompletionPercentage = (
  surveyState: SurveyState,
  phases: { id: number; name: string; questions: Question[] }[]
): number => {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  phases.forEach((phase) => {
    const visibleQuestions = getVisibleQuestions(
      phase.questions,
      surveyState.userAnswers,
      phase.id
    );
    totalQuestions += visibleQuestions.length;

    const phaseAnswered = visibleQuestions.filter((question) =>
      surveyState.userAnswers.some(
        (answer) => answer.questionId === question.id && answer.phaseId === phase.id
      )
    ).length;

    answeredQuestions += phaseAnswered;
  });

  return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
};

export const getQuestionAnswer = (
  questionId: number,
  phaseId: number,
  userAnswers: UserAnswer[]
): string | string[] | number | null => {
  const answer = userAnswers.find(
    (ans) => ans.questionId === questionId && ans.phaseId === phaseId
  );
  return answer ? answer.value : null;
};

// Helper to get all answers for a phase
export const getPhaseAnswers = (phaseId: number, userAnswers: UserAnswer[]): UserAnswer[] => {
  return userAnswers.filter((answer) => answer.phaseId === phaseId);
};

// Helper to check if all visible questions in a phase are answered
export const isPhaseComplete = (
  phaseQuestions: Question[],
  userAnswers: UserAnswer[],
  phaseId: number
): boolean => {
  const visibleQuestions = getVisibleQuestions(phaseQuestions, userAnswers, phaseId);
  const answeredQuestions = visibleQuestions.filter((question) =>
    userAnswers.some((answer) => answer.questionId === question.id && answer.phaseId === phaseId)
  ).length;

  return visibleQuestions.length > 0 && answeredQuestions === visibleQuestions.length;
};
