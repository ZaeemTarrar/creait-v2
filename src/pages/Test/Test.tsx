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
  Stepper,
  Step,
  StepLabel,
  Avatar,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Lightbulb as LightbulbIcon,
  RocketLaunch as RocketLaunchIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import type { Question, Phase } from "../../store/features/questions/types";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  saveAnswerAction,
  setCurrentQuestionIndexAction,
  setCurrentPhaseAction,
  setPhaseCompletionAction,
  setShowResultsAction,
  goToNextPhaseAction,
  goToPreviousPhaseAction,
  resetSurveyAction,
} from "../../store/features/questions/actions";
import {
  getVisibleQuestions,
  getPhaseCompletionPercentage,
  getOverallCompletionPercentage,
  getQuestionAnswer,
} from "../../utils/survey/index";
import type { Option, InputType } from "../../components/FormInput/FormInput.types";

const Test = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const survey = useAppSelector((state) => state.questions.survey);
  const surveyState = useAppSelector((state) => state.questions.surveyState);
  const { currentPhase, currentQuestionIndex, userAnswers, phaseCompletion, showResults } =
    surveyState;

  const [commentary, setCommentary] = useState<string>("");

  // Generate commentary function - Moved to top to avoid use-before-declaration
  const generateCommentary = useCallback(
    (questionId: number, value: string | string[] | number) => {
      const stringValue = Array.isArray(value) ? value.join(", ") : value.toString();

      const commentaries: Record<number, (val: string) => string> = {
        1: (val) =>
          `A ${val} startup! Great choice. This platform type offers unique opportunities and challenges.`,
        4: (val) =>
          `Targeting the ${val.toLowerCase()} market shows you've thought about your audience.`,
        10: (val) => `With ${val} in capital, you have a solid foundation to start building.`,
        27: (val) =>
          `Having a ${val.toLowerCase()} team structure is important for early-stage startups.`,
        45: (val) =>
          `A ${val.toLowerCase()} launch timeline gives you time to validate and iterate.`,
        74: (val) =>
          `The ${val.toLowerCase()} revenue model can be very effective when executed well.`,
      };

      if (commentaries[questionId]) {
        setCommentary(commentaries[questionId](stringValue));
      }
    },
    []
  );

  // Get current phase data
  const currentPhaseData = useMemo(() => {
    return survey.phases.find((phase: Phase) => phase.id === currentPhase);
  }, [survey.phases, currentPhase]);

  // Get visible questions for current phase
  const visibleQuestions = useMemo(() => {
    if (!currentPhaseData) return [];
    return getVisibleQuestions(currentPhaseData.questions, userAnswers, currentPhase);
  }, [currentPhaseData, userAnswers, currentPhase]);

  // Get current question
  const currentQuestion = useMemo(() => {
    if (visibleQuestions.length === 0) return null;
    return visibleQuestions[currentQuestionIndex];
  }, [visibleQuestions, currentQuestionIndex]);

  // Check if current question is answered
  const isCurrentQuestionAnswered = useMemo(() => {
    if (!currentQuestion) return false;
    const answer = getQuestionAnswer(currentQuestion.id, currentPhase, userAnswers);
    return answer !== null && answer !== "" && (!Array.isArray(answer) || answer.length > 0);
  }, [currentQuestion, currentPhase, userAnswers]);

  // Get phase completion percentage
  const phaseCompletionPercentage = useMemo(() => {
    if (!currentPhaseData) return 0;
    return getPhaseCompletionPercentage(currentPhaseData.questions, userAnswers, currentPhase);
  }, [currentPhaseData, userAnswers, currentPhase]);

  // Get overall completion percentage
  const overallCompletionPercentage = useMemo(() => {
    return getOverallCompletionPercentage(surveyState, survey.phases);
  }, [surveyState, survey.phases]);

  // Handle input change
  const handleInputChange = useCallback(
    (questionId: number, value: string | string[] | number) => {
      // Save the answer
      dispatch(saveAnswerAction(questionId, value, currentPhase));

      // Generate commentary based on answer
      generateCommentary(questionId, value);
    },
    [dispatch, currentPhase, generateCommentary]
  );

  // Handle next question
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      dispatch(setCurrentQuestionIndexAction(currentQuestionIndex + 1));
    } else if (phaseCompletionPercentage === 100) {
      // Mark phase as completed and show results
      dispatch(setPhaseCompletionAction(currentPhase, true));
      dispatch(setShowResultsAction(true));
    }
  }, [
    currentQuestionIndex,
    visibleQuestions.length,
    phaseCompletionPercentage,
    currentPhase,
    dispatch,
  ]);

  // Handle previous question
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndexAction(currentQuestionIndex - 1));
    }
  }, [currentQuestionIndex, dispatch]);

  // Handle next phase
  const handleNextPhase = useCallback(() => {
    dispatch(setShowResultsAction(false));
    dispatch(goToNextPhaseAction());
  }, [dispatch]);

  // Handle previous phase
  const handlePreviousPhase = useCallback(() => {
    dispatch(goToPreviousPhaseAction());
  }, [dispatch]);

  // Reset survey
  const handleReset = useCallback(() => {
    dispatch(resetSurveyAction());
    setCommentary("");
  }, [dispatch]);

  // Navigate to subscription
  const handleCompleteSurvey = useCallback(() => {
    navigate("/subscription");
  }, [navigate]);

  // Convert question options to FormInput options
  const convertToFormInputOptions = useCallback(
    (options: { value: string; label: string }[]): Option[] => {
      return options.map((option) => ({
        value: option.value,
        label: option.label,
      }));
    },
    []
  );

  // Get FormInput type
  const getFormInputType = useCallback((questionType: string): InputType => {
    const typeMap: Record<string, InputType> = {
      radio: "radio",
      checkbox: "checkbox",
      dropdown: "dropdown",
      text: "text",
      textarea: "textarea",
      range: "range",
    };
    return typeMap[questionType] || "text";
  }, []);

  // Get phase icon
  const getPhaseIcon = useCallback((phaseId: number) => {
    switch (phaseId) {
      case 1:
        return <LightbulbIcon />;
      case 2:
        return <GroupIcon />;
      case 3:
        return <RocketLaunchIcon />;
      case 4:
        return <TrendingUpIcon />;
      default:
        return <LightbulbIcon />;
    }
  }, []);

  // Get phase color
  const getPhaseColor = useCallback((phaseId: number) => {
    switch (phaseId) {
      case 1:
        return "primary";
      case 2:
        return "secondary";
      case 3:
        return "success";
      case 4:
        return "warning";
      default:
        return "primary";
    }
  }, []);

  // Get phase result data
  const getPhaseResult = useCallback((phaseId: number) => {
    interface PhaseResult {
      title: string;
      summary: string;
      insights: string[];
      recommendations: string[];
      image: string;
    }

    const results: Record<number, PhaseResult> = {
      1: {
        title: "Startup Foundation Analysis",
        summary:
          "Your startup shows strong potential with clear market focus and adequate initial capital.",
        insights: [
          "Clear product-market fit identified",
          "Adequate capital for initial development",
          "Well-defined target audience",
          "Competitive analysis completed",
        ],
        recommendations: [
          "Proceed with MVP development",
          "Consider pre-launch marketing",
          "Validate pricing strategy",
        ],
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      2: {
        title: "Team & Business Model Assessment",
        summary: "Your team composition and business model are aligned with your startup goals.",
        insights: [
          "Team skills well-distributed",
          "Revenue model clearly defined",
          "Growth strategy in place",
          "Key partnerships identified",
        ],
        recommendations: [
          "Consider adding technical expertise",
          "Test pricing with early users",
          "Develop partner onboarding process",
        ],
        image:
          "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      3: {
        title: "Launch & Resource Planning",
        summary: "Your launch timeline and resource allocation are realistic and well-planned.",
        insights: [
          "Realistic launch timeline",
          "Adequate technical resources",
          "Clear development roadmap",
          "User acquisition strategy defined",
        ],
        recommendations: [
          "Consider beta testing program",
          "Plan for user feedback collection",
          "Prepare for scaling infrastructure",
        ],
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      4: {
        title: "Growth & Support Strategy",
        summary: "Your growth strategy and support requirements are comprehensive and actionable.",
        insights: [
          "Scalable growth channels identified",
          "Funding strategy in place",
          "Operations support planned",
          "Brand development roadmap",
        ],
        recommendations: [
          "Implement growth hacking techniques",
          "Prepare investor pitch deck",
          "Set up customer support system",
        ],
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
    };
    return results[phaseId] || results[1];
  }, []);

  // Get phase statistics
  const getPhaseStats = useCallback(
    (phaseId: number) => {
      const phase = survey.phases.find((p) => p.id === phaseId);
      if (!phase) return { total: 0, answered: 0 };

      const visible = getVisibleQuestions(phase.questions, userAnswers, phaseId);
      const answered = visible.filter((q: Question) =>
        userAnswers.some((a) => a.questionId === q.id && a.phaseId === phaseId)
      ).length;

      return { total: visible.length, answered };
    },
    [survey.phases, userAnswers]
  );

  // Get all phases stats
  const allPhasesStats = useMemo(() => {
    return survey.phases.map((phase: Phase) => ({
      id: phase.id,
      name: phase.name,
      ...getPhaseStats(phase.id),
      completed: phaseCompletion[phase.id] || false,
    }));
  }, [survey.phases, getPhaseStats, phaseCompletion]);

  if (!currentPhaseData || visibleQuestions.length === 0) {
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

  const currentPhaseColor = getPhaseColor(currentPhase);
  const phaseResult = getPhaseResult(currentPhase);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Startup Assessment Journey
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Complete each phase to build a comprehensive startup plan. Your answers will help us
                provide personalized recommendations.
              </Typography>
            </Box>
            <Box sx={{ minWidth: { xs: "100%", md: 300 } }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "primary.main",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h3" fontWeight="bold">
                  {overallCompletionPercentage}%
                </Typography>
                <Typography variant="body1">Overall Completion</Typography>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Layout - Using CSS Grid instead of MUI Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr 300px" },
          gap: 3,
          width: "100%",
        }}
      >
        {/* Left Sidebar - Progress & Navigation */}
        <Box>
          <Stack spacing={3}>
            {/* Phase Stepper */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Phases
                </Typography>
                <Stepper activeStep={currentPhase - 1} orientation="vertical">
                  {survey.phases.map((phase: Phase) => {
                    const phaseColor = getPhaseColor(phase.id);
                    const phaseIcon = getPhaseIcon(phase.id);
                    const isCompleted = phaseCompletion[phase.id] || false;
                    const isCurrent = phase.id === currentPhase;
                    const stats = getPhaseStats(phase.id);

                    return (
                      <Step key={phase.id} completed={isCompleted}>
                        <StepLabel
                          icon={
                            <Avatar
                              sx={{
                                bgcolor: isCompleted
                                  ? "success.main"
                                  : isCurrent
                                  ? `${phaseColor}.main`
                                  : "grey.300",
                                color: isCompleted
                                  ? "success.contrastText"
                                  : isCurrent
                                  ? `${phaseColor}.contrastText`
                                  : "grey.700",
                              }}
                            >
                              {phaseIcon}
                            </Avatar>
                          }
                        >
                          <Typography variant="subtitle2" fontWeight="medium">
                            {phase.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stats.answered} of {stats.total} questions
                          </Typography>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Quick Stats
                </Typography>
                <Stack spacing={2}>
                  {allPhasesStats.map((phase) => {
                    const phaseColor = getPhaseColor(phase.id);
                    const isCurrent = phase.id === currentPhase;

                    return (
                      <Box key={phase.id}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {phase.name}
                          </Typography>
                          <Chip
                            label={`${phase.answered}/${phase.total}`}
                            size="small"
                            color={phase.completed ? "success" : "default"}
                            variant={isCurrent ? "filled" : "outlined"}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={phase.total > 0 ? (phase.answered / phase.total) * 100 : 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: isCurrent ? `${phaseColor}.light` : "grey.100",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: isCurrent ? `${phaseColor}.main` : "grey.400",
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleReset}
                    fullWidth
                  >
                    Reset All
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/")}
                    fullWidth
                  >
                    Back to Home
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box>
          {showResults ? (
            // Results View
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: `${currentPhaseColor}.main` }}>
                    {getPhaseIcon(currentPhase)}
                  </Avatar>
                }
                title={
                  <Typography variant="h5" fontWeight="bold">
                    Phase {currentPhase} Complete!
                  </Typography>
                }
                subheader={currentPhaseData.name}
                sx={{ backgroundColor: `${currentPhaseColor}.light` }}
              />
              <CardContent>
                <Box sx={{ mb: 4 }}>
                  <img
                    src={phaseResult.image}
                    alt="Phase Result"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "24px",
                    }}
                  />

                  <Typography variant="h6" gutterBottom fontWeight="medium" color="primary">
                    {phaseResult.title}
                  </Typography>

                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {phaseResult.summary}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight="medium"
                          color="success.main"
                        >
                          Key Insights
                        </Typography>
                        <Stack spacing={1}>
                          {phaseResult.insights.map((insight: string, index: number) => (
                            <Box key={index} display="flex" alignItems="flex-start">
                              <CheckCircleIcon
                                sx={{ color: "success.main", mr: 1, mt: 0.5, fontSize: 16 }}
                              />
                              <Typography variant="body2">{insight}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight="medium"
                          color="info.main"
                        >
                          Recommendations
                        </Typography>
                        <Stack spacing={1}>
                          {phaseResult.recommendations.map((rec: string, index: number) => (
                            <Box key={index} display="flex" alignItems="flex-start">
                              <ArrowForwardIcon
                                sx={{ color: "info.main", mr: 1, mt: 0.5, fontSize: 16 }}
                              />
                              <Typography variant="body2">{rec}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    </Box>
                  </Box>
                </Box>

                {/* Navigation for Results */}
                <Box sx={{ pt: 3, borderTop: 1, borderColor: "divider" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={handlePreviousPhase}
                      disabled={currentPhase === 1}
                    >
                      Previous Phase
                    </Button>

                    {currentPhase < 4 ? (
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNextPhase}
                        sx={{ minWidth: 200 }}
                      >
                        Continue to Phase {currentPhase + 1}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        endIcon={<CheckCircleIcon />}
                        onClick={handleCompleteSurvey}
                        sx={{ minWidth: 200 }}
                      >
                        Complete Assessment
                      </Button>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ) : (
            // Question View
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: `${currentPhaseColor}.main` }}>
                    {getPhaseIcon(currentPhase)}
                  </Avatar>
                }
                title={
                  <Typography variant="h6">
                    Phase {currentPhase}: {currentPhaseData.name}
                  </Typography>
                }
                subheader={`Question ${currentQuestionIndex + 1} of ${visibleQuestions.length}`}
                sx={{ backgroundColor: `${currentPhaseColor}.light` }}
              />
              <CardContent>
                {/* Progress Bar */}
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Phase Progress: {phaseCompletionPercentage}%
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {currentQuestionIndex + 1}/{visibleQuestions.length}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={phaseCompletionPercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: `${currentPhaseColor}.light`,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: `${currentPhaseColor}.main`,
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>

                {/* Question */}
                {currentQuestion && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "medium" }}>
                      {currentQuestion.question}
                    </Typography>

                    <FormInput
                      type={getFormInputType(currentQuestion.type)}
                      name={`question-${currentQuestion.id}`}
                      label="Your Answer"
                      options={convertToFormInputOptions(currentQuestion.options)}
                      value={getQuestionAnswer(currentQuestion.id, currentPhase, userAnswers) || ""}
                      required={true}
                      onChange={(_name, value) => handleInputChange(currentQuestion.id, value)}
                      helpText="Select your answer to proceed"
                      inline={currentQuestion.type === "radio"}
                    />
                  </Box>
                )}

                {/* Commentary Section */}
                {commentary && (
                  <Alert severity="info" icon={<LightbulbIcon />} sx={{ mb: 3, borderRadius: 2 }}>
                    <Typography variant="body2">{commentary}</Typography>
                  </Alert>
                )}

                {/* Navigation */}
                <Box sx={{ pt: 3, borderTop: 1, borderColor: "divider" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        endIcon={
                          currentQuestionIndex === visibleQuestions.length - 1 ? (
                            <CheckCircleIcon />
                          ) : (
                            <ArrowForwardIcon />
                          )
                        }
                        onClick={handleNext}
                        disabled={!isCurrentQuestionAnswered}
                        sx={{ minWidth: 200 }}
                      >
                        {currentQuestionIndex === visibleQuestions.length - 1
                          ? "Complete Phase"
                          : "Next Question"}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Right Sidebar - Insights & Stats */}
        <Box>
          <Stack spacing={3}>
            {/* Phase Stats */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Current Phase Stats
                </Typography>
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: `${currentPhaseColor}.light`,
                      color: `${currentPhaseColor}.dark`,
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {phaseCompletionPercentage}%
                    </Typography>
                    <Typography variant="body2">Phase Completion</Typography>
                  </Paper>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: "success.light",
                          color: "success.dark",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {getPhaseStats(currentPhase).answered}
                        </Typography>
                        <Typography variant="caption">Answered</Typography>
                      </Paper>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: "info.light",
                          color: "info.dark",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {getPhaseStats(currentPhase).total - getPhaseStats(currentPhase).answered}
                        </Typography>
                        <Typography variant="caption">Remaining</Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Tips for This Phase
                </Typography>
                <Stack spacing={1}>
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    <Typography variant="caption">
                      Answer honestly for the best recommendations
                    </Typography>
                  </Alert>
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    <Typography variant="caption">You can return to previous questions</Typography>
                  </Alert>
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    <Typography variant="caption">Each phase builds on previous answers</Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>

            {/* Phase Navigation */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Phase Navigation
                </Typography>
                <Stack spacing={1}>
                  {survey.phases.map((phase: Phase) => {
                    const phaseColor = getPhaseColor(phase.id);
                    const isCompleted = phaseCompletion[phase.id] || false;
                    const isCurrent = phase.id === currentPhase;

                    return (
                      <Button
                        key={phase.id}
                        variant={isCurrent ? "contained" : "outlined"}
                        color={phaseColor}
                        size="small"
                        fullWidth
                        onClick={() => {
                          if (isCompleted) {
                            dispatch(setCurrentPhaseAction(phase.id));
                            dispatch(setShowResultsAction(true));
                          }
                        }}
                        disabled={!isCompleted && !isCurrent}
                        startIcon={isCompleted ? <CheckCircleIcon /> : undefined}
                      >
                        {phase.name}
                      </Button>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default Test;
