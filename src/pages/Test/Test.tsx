import { useState, useCallback, useMemo } from "react";
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  Alert,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import FormInput from "../../components/FormInput/FormInput";
import type { Phase, PrimaryQuestion, QuestionOption } from "../../store/features/questions/types";
import { useAppSelector } from "../../store/hooks";
import type { Option, ValidationRule, InputType } from "../../components/FormInput/FormInput.types";

const Test = () => {
  const survey = useAppSelector((state) => state.questions.survey);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [validationStatus, setValidationStatus] = useState<Record<number, boolean>>({});
  const [touchedQuestions, setTouchedQuestions] = useState<Record<number, boolean>>({});

  const getPrimaryQuestionsByPhaseId = useCallback(
    (id: number): PrimaryQuestion[] | undefined => {
      const phase = survey.phases.find((phase: Phase) => phase.id === id);
      return phase?.primary_questions;
    },
    [survey.phases]
  );

  // Memoize questions to prevent unnecessary re-renders
  const questions = useMemo(() => {
    return getPrimaryQuestionsByPhaseId(1) || [];
  }, [getPrimaryQuestionsByPhaseId]);

  const currentQuestion = questions[currentQuestionIndex];
  const showQuestions = questions.length > 0;

  // Derive initial validation status from questions - computed during render
  const derivedInitialValidation = useMemo(() => {
    const initialValidation: Record<number, boolean> = {};
    questions.forEach((q) => {
      initialValidation[q.id] = false;
    });
    return initialValidation;
  }, [questions]);

  // Derive initial touched status from questions - computed during render
  const derivedInitialTouched = useMemo(() => {
    const initialTouched: Record<number, boolean> = {};
    questions.forEach((q) => {
      initialTouched[q.id] = false;
    });
    return initialTouched;
  }, [questions]);

  // Merge current validation status with derived initial state
  const mergedValidationStatus = useMemo(() => {
    if (Object.keys(validationStatus).length === 0) {
      return derivedInitialValidation;
    }

    // Ensure all current questions have a validation status
    const merged: Record<number, boolean> = { ...validationStatus };
    questions.forEach((q) => {
      if (!(q.id in merged)) {
        merged[q.id] = false;
      }
    });
    return merged;
  }, [validationStatus, derivedInitialValidation, questions]);

  // Merge current touched status with derived initial state
  const mergedTouchedQuestions = useMemo(() => {
    if (Object.keys(touchedQuestions).length === 0) {
      return derivedInitialTouched;
    }

    // Ensure all current questions have a touched status
    const merged: Record<number, boolean> = { ...touchedQuestions };
    questions.forEach((q) => {
      if (!(q.id in merged)) {
        merged[q.id] = false;
      }
    });
    return merged;
  }, [touchedQuestions, derivedInitialTouched, questions]);

  // Single handler for all input changes
  const handleInputChange = useCallback(
    (questionId: number, value: string | string[] | number, isValid: boolean) => {
      // Store the answer
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: value as string | string[],
      }));

      // Update validation status
      setValidationStatus((prev) => ({
        ...prev,
        [questionId]: isValid,
      }));

      // Mark question as touched
      setTouchedQuestions((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    },
    []
  );

  // Handle next button click
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert("All questions completed!");
    }
  }, [currentQuestionIndex, questions.length]);

  // Handle previous button click
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Reset all answers
  const handleReset = useCallback(() => {
    setUserAnswers({});
    setValidationStatus({});
    setTouchedQuestions({});
    setCurrentQuestionIndex(0);
  }, []);

  // Check if current question is answered and valid
  const isCurrentQuestionValid = useCallback(() => {
    if (!currentQuestion) return false;
    return mergedValidationStatus[currentQuestion.id] === true;
  }, [currentQuestion, mergedValidationStatus]);

  // Convert survey options to FormInput options with proper type handling
  const convertToFormInputOptions = useCallback((options: QuestionOption[]): Option[] => {
    return options.map((option) => ({
      value: String(option.value), // Convert to string since FormInput expects string values
      label: String(option.value), // Convert to string for label
    }));
  }, []);

  // Get validation rules based on question type
  const getValidationRules = useCallback((question: PrimaryQuestion): ValidationRule[] => {
    const rules: ValidationRule[] = [{ type: "required", message: "This question is required" }];

    // Add type-specific validations
    if (question.type === "text" || question.type === "textarea") {
      rules.push({ type: "minLength", value: 1, message: "Please enter a response" });
    }

    return rules;
  }, []);

  // Get current progress percentage
  const getProgressPercentage = useCallback(() => {
    const answeredQuestions = Object.keys(mergedValidationStatus).filter(
      (key) => mergedValidationStatus[parseInt(key)] === true
    ).length;
    return Math.round((answeredQuestions / questions.length) * 100);
  }, [mergedValidationStatus, questions.length]);

  // Get statistics
  const answeredCount = Object.keys(userAnswers).length;
  const remainingCount = questions.length - answeredCount;
  const progressPercentage = getProgressPercentage();

  if (!showQuestions || questions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading survey questions...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Safely convert question type to FormInput type
  const getFormInputType = (questionType: string): InputType => {
    // Map survey question types to FormInput types
    const typeMap: Record<string, InputType> = {
      radio: "radio",
      checkbox: "checkbox",
      dropdown: "dropdown",
      text: "text",
      textarea: "textarea",
      email: "email",
      password: "password",
      range: "range",
    };

    return typeMap[questionType] || "text";
  };

  // Determine if we should show error for current question
  const showError =
    currentQuestion &&
    mergedTouchedQuestions[currentQuestion.id] &&
    !mergedValidationStatus[currentQuestion.id];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        {/* Progress Card */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ mb: { xs: 2, md: 0 } }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Startup Survey
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Answer these questions to help us understand your startup
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Chip
                  label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
                  color="primary"
                  sx={{ fontSize: "0.9rem", px: 1 }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {answeredCount} of {questions.length} answered
                </Typography>
                <Typography variant="body2" color="primary" fontWeight="medium">
                  {progressPercentage}% Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          {/* Main Question Card */}
          <Box sx={{ flex: 2 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
              <CardHeader
                title={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <Typography variant="h6">Question {currentQuestionIndex + 1}</Typography>
                    <Chip
                      label={currentQuestion.type.toUpperCase()}
                      size="small"
                      sx={{ backgroundColor: "primary.light", color: "primary.contrastText" }}
                    />
                  </Box>
                }
                sx={{ backgroundColor: "primary.main", color: "white" }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: "medium" }}>
                  {currentQuestion.question}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <FormInput
                    type={getFormInputType(currentQuestion.type)}
                    name={`question-${currentQuestion.id}`}
                    label="Your Answer"
                    options={convertToFormInputOptions(currentQuestion.options)}
                    value={userAnswers[currentQuestion.id] || ""}
                    required={true}
                    validation={getValidationRules(currentQuestion)}
                    onChange={(_name, value, isValid) =>
                      handleInputChange(currentQuestion.id, value, isValid)
                    }
                    helpText="Select your answer to proceed to the next question"
                    inline={currentQuestion.type === "radio" || currentQuestion.type === "checkbox"}
                  />
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ pt: 3, borderTop: 1, borderColor: "divider" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                      variant="outlined"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      sx={{ minWidth: 120 }}
                    >
                      Previous
                    </Button>

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        sx={{ minWidth: 120 }}
                      >
                        Reset All
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!isCurrentQuestionValid()}
                        sx={{ minWidth: 150 }}
                      >
                        {currentQuestionIndex < questions.length - 1
                          ? "Next Question"
                          : "Complete Survey"}
                      </Button>
                    </Stack>
                  </Stack>

                  {showError && (
                    <Alert severity="warning" sx={{ mt: 3 }}>
                      Please answer this question before proceeding to the next one.
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Stats Sidebar */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", lg: 300 } }}>
            <Stack spacing={3}>
              {/* Completion Stats */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Survey Progress
                  </Typography>
                  <Stack spacing={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "primary.main",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h4" align="center" fontWeight="bold">
                        {progressPercentage}%
                      </Typography>
                      <Typography variant="body2" align="center">
                        Completion
                      </Typography>
                    </Paper>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          flex: 1,
                          backgroundColor: "success.light",
                          color: "success.contrastText",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {answeredCount}
                        </Typography>
                        <Typography variant="body2">Questions Answered</Typography>
                      </Paper>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          flex: 1,
                          backgroundColor: "info.light",
                          color: "info.contrastText",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {remainingCount}
                        </Typography>
                        <Typography variant="body2">Questions Remaining</Typography>
                      </Paper>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Question Navigation */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Question Navigation
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflow: "auto", pr: 1 }}>
                    <Stack spacing={1}>
                      {questions.map((q, index) => (
                        <Button
                          key={q.id}
                          variant={index === currentQuestionIndex ? "contained" : "outlined"}
                          color={index === currentQuestionIndex ? "primary" : "inherit"}
                          size="small"
                          fullWidth
                          onClick={() => setCurrentQuestionIndex(index)}
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            py: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Q{index + 1}:{" "}
                            {q.question.length > 30
                              ? `${q.question.substring(0, 30)}...`
                              : q.question}
                          </Typography>
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Tips
                  </Typography>
                  <Stack spacing={1}>
                    <Alert severity="info" icon={false} sx={{ py: 0.5 }}>
                      <Typography variant="body2">
                        Answer all questions to complete the survey
                      </Typography>
                    </Alert>
                    <Alert severity="info" icon={false} sx={{ py: 0.5 }}>
                      <Typography variant="body2">Use Previous/Next buttons to navigate</Typography>
                    </Alert>
                    <Alert severity="info" icon={false} sx={{ py: 0.5 }}>
                      <Typography variant="body2">Reset All will clear all your answers</Typography>
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Test;
