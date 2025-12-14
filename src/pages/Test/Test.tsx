import { useState, useEffect } from "react";
import FormInput from "../../components/FormInput/FormInput";
import type { Phase, PrimaryQuestion } from "../../store/features/questions/types";
import { useAppSelector } from "../../store/hooks";
import type { Option, ValidationRule } from "../../components/FormInput/FormInput";

const Test = () => {
  const survey = useAppSelector((state) => state.questions.survey);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [validationStatus, setValidationStatus] = useState<Record<number, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<boolean>(false);

  const getPrimaryQuestionsByPhaseId = (id: number): PrimaryQuestion[] | undefined => {
    const [phase] = survey.phases.filter((phase: Phase) => phase.id == id);
    if (phase) return phase.primary_questions;
    else return undefined;
  };

  const questions = getPrimaryQuestionsByPhaseId(1) || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Initialize validation status when questions load
  useEffect(() => {
    if (questions.length > 0) {
      const initialValidation: Record<number, boolean> = {};
      questions.forEach((q) => {
        initialValidation[q.id] = false;
      });
      setValidationStatus(initialValidation);
      setShowQuestions(true);
    }
  }, [questions]);

  // Single handler for all input changes
  const handleInputChange = (
    questionId: number,
    value: string | string[] | number,
    isValid: boolean
  ) => {
    console.log("Question Input:", {
      questionId: questionId,
      question: questions.find((q) => q.id === questionId)?.question,
      value: value,
      type: typeof value,
      isValid: isValid,
      timestamp: new Date().toISOString(),
    });

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
  };

  // Handle next button click
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All questions completed
      console.log("All questions completed:", userAnswers);
      alert("All questions completed! Check console for answers.");
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Reset all answers
  const handleReset = () => {
    setUserAnswers({});
    setValidationStatus({});
    setCurrentQuestionIndex(0);
    console.log("Survey reset");
  };

  // Check if current question is answered and valid
  const isCurrentQuestionValid = () => {
    if (!currentQuestion) return false;
    return validationStatus[currentQuestion.id] === true;
  };

  // Convert survey options to FormInput options
  const convertToFormInputOptions = (options: any[]): Option[] => {
    return options.map((option) => ({
      value: option.value,
      label: option.value,
      // You could add followup info to label if needed
      // label: `${option.value} (${option.followup_questions.length} followups)`
    }));
  };

  // Get validation rules based on question type
  const getValidationRules = (question: PrimaryQuestion): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // All questions are required in this survey
    rules.push({ type: "required", message: "This question is required" });

    // Add type-specific validations
    if (question.type === "text" || question.type === "textarea") {
      rules.push({ type: "minLength", value: 1, message: "Please enter a response" });
    }

    return rules;
  };

  // Get current progress percentage
  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(validationStatus).filter(
      (key) => validationStatus[parseInt(key)] === true
    ).length;
    return Math.round((answeredQuestions / questions.length) * 100);
  };

  if (!showQuestions || questions.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading questions...</span>
        </div>
        <p className="mt-3">Loading survey questions...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Progress Bar */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="card-title mb-1">Startup Survey</h4>
              <p className="text-muted mb-0">
                Answer these questions to help us understand your startup
              </p>
            </div>
            <span className="badge bg-primary rounded-pill">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="progress" style={{ height: "10px" }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${getProgressPercentage()}%` }}
              aria-valuenow={getProgressPercentage()}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted">
              {Object.keys(userAnswers).length} of {questions.length} answered
            </small>
            <small className="text-primary">{getProgressPercentage()}% Complete</small>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Question {currentQuestionIndex + 1}</h5>
                <span className="badge bg-light text-primary">
                  {currentQuestion.type.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="card-body">
              <div className="mb-4">
                <h4 className="mb-4">{currentQuestion.question}</h4>

                {/* Display only current question */}
                <FormInput
                  type={currentQuestion.type as "radio" | "checkbox" | "dropdown" | "text"}
                  name={`question-${currentQuestion.id}`}
                  label="Your Answer"
                  options={convertToFormInputOptions(currentQuestion.options)}
                  value={userAnswers[currentQuestion.id] || ""}
                  required={true}
                  validation={getValidationRules(currentQuestion)}
                  onChange={(name, value, isValid) =>
                    handleInputChange(currentQuestion.id, value, isValid)
                  }
                  helpText="Select your answer to proceed to the next question"
                  className="mt-3"
                  containerClassName="mb-4"
                  inline={currentQuestion.type === "radio" || currentQuestion.type === "checkbox"}
                />

                {/* Followup info (for debugging/understanding) */}
                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Question ID:</strong> {currentQuestion.id} |<strong> Type:</strong>{" "}
                    {currentQuestion.type} |<strong> Options:</strong>{" "}
                    {currentQuestion.options.length}
                  </small>
                  <br />
                  <small className="text-muted">
                    Each option triggers different follow-up questions based on your selection.
                  </small>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-4 pt-4 border-top">
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Previous
                  </button>

                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-danger me-2"
                      onClick={handleReset}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reset All
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!isCurrentQuestionValid()}
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          Next Question <i className="bi bi-arrow-right ms-2"></i>
                        </>
                      ) : (
                        <>
                          Complete Survey <i className="bi bi-check-circle ms-2"></i>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {!isCurrentQuestionValid() && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Please answer this question before proceeding to the next one.
                  </div>
                )}
              </div>
            </div>

            {/* Debug Panel - Shows all answers so far */}
            <div className="card-footer bg-light">
              <div className="accordion" id="debugAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#debugCollapse"
                    >
                      <i className="bi bi-code-slash me-2"></i>
                      Debug Information (Click to expand)
                    </button>
                  </h2>
                  <div id="debugCollapse" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Current Answers</h6>
                          <div
                            className="bg-dark text-light p-3 rounded"
                            style={{ fontSize: "0.8rem" }}
                          >
                            <pre className="mb-0">{JSON.stringify(userAnswers, null, 2)}</pre>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6>Validation Status</h6>
                          <div className="p-3 bg-white border rounded">
                            <ul className="list-unstyled mb-0">
                              {Object.entries(validationStatus).map(([questionId, isValid]) => (
                                <li key={questionId} className="mb-2 d-flex align-items-center">
                                  <span
                                    className={`badge ${isValid ? "bg-success" : "bg-danger"} me-2`}
                                  >
                                    {isValid ? "✓" : "✗"}
                                  </span>
                                  <span className="text-muted">
                                    Q{questionId}:{" "}
                                    {questions.find((q) => q.id === parseInt(questionId))?.question}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top">
                        <h6>Question Details</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Type</th>
                                <th>Options</th>
                                <th>Answer</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {questions.map((q, index) => (
                                <tr
                                  key={q.id}
                                  className={index === currentQuestionIndex ? "table-primary" : ""}
                                >
                                  <td>{q.id}</td>
                                  <td>
                                    {q.question.length > 50
                                      ? q.question.substring(0, 50) + "..."
                                      : q.question}
                                  </td>
                                  <td>
                                    <span className="badge bg-secondary">{q.type}</span>
                                  </td>
                                  <td>{q.options.length}</td>
                                  <td>
                                    {userAnswers[q.id] ? (
                                      <span className="text-success">
                                        {Array.isArray(userAnswers[q.id])
                                          ? `[${(userAnswers[q.id] as string[]).join(", ")}]`
                                          : userAnswers[q.id]}
                                      </span>
                                    ) : (
                                      <span className="text-muted">Not answered</span>
                                    )}
                                  </td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        validationStatus[q.id] ? "bg-success" : "bg-warning"
                                      }`}
                                    >
                                      {validationStatus[q.id] ? "Answered" : "Pending"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">{Object.keys(userAnswers).length}</h5>
              <p className="card-text text-muted">Questions Answered</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">{getProgressPercentage()}%</h5>
              <p className="card-text text-muted">Completion</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">
                {questions.length - Object.keys(userAnswers).length}
              </h5>
              <p className="card-text text-muted">Questions Remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
