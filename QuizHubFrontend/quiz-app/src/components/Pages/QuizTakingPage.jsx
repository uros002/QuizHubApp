import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  AlertCircle,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";

import { Answer } from "../Models";

// Timer Component
const Timer = ({ timeLeft, totalTime, onTimeUp }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = percentage <= 20;

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border">
      <Clock
        className={`h-5 w-5 ${isLowTime ? "text-red-500" : "text-blue-500"}`}
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Time Remaining
          </span>
          <span
            className={`text-lg font-bold ${
              isLowTime ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isLowTime ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-600">
          {current} of {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Single Choice Question Component
const SingleChoiceQuestion = ({ question, selectedAnswer, onAnswerChange }) => {
  return (
    <div className="space-y-3">
      {question.answers.map((option, index) => (
        <label
          key={option.id}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
            selectedAnswer === option.text
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option.id}
            checked={selectedAnswer === option.text}
            onChange={() => onAnswerChange(option.text)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedAnswer === option.text
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300"
            }`}
          >
            {selectedAnswer === option.text && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <span className="text-gray-700">{option.text}</span>
        </label>
      ))}
    </div>
  );
};

// Multiple Choice Question Component
const MultipleChoiceQuestion = ({
  question,
  selectedAnswers,
  onAnswerChange,
}) => {
  const handleToggle = (index) => {
    const newAnswers = selectedAnswers.includes(index)
      ? selectedAnswers.filter((i) => i !== index)
      : [...selectedAnswers, index];
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-3">
      {question.answers.map((option) => (
        <label
          key={option.id}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
            selectedAnswers.includes(option.text)
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <input
            type="checkbox"
            checked={selectedAnswers.includes(option.text)}
            onChange={() => handleToggle(option.text)}
            className="sr-only"
          />
          {selectedAnswers.includes(option.text) ? (
            <CheckSquare className="w-5 h-5 text-blue-500 mr-3" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 mr-3" />
          )}
          <span className="text-gray-700">{option.text}</span>
        </label>
      ))}
    </div>
  );
};

// True/False Question Component
const TrueFalseQuestion = ({ question, selectedAnswer, onAnswerChange }) => {
  //console.log("SELECTED ANSWER: ", selectedAnswer);
  return (
    <div className="space-y-3">
      {[true, false].map((value) => (
        <label
          key={value.toString()}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
            selectedAnswer === value.toString()
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={value.toString()}
            checked={selectedAnswer === value.toString()}
            onChange={() => onAnswerChange(value)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedAnswer === value.toString()
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300"
            }`}
          >
            {selectedAnswer === value.toString() && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <span className="text-gray-700">{value ? "True" : "False"}</span>
        </label>
      ))}
    </div>
  );
};

// Fill in the Blank Question Component
const FillBlankQuestion = ({ question, answers, onAnswerChange }) => {
  const handleInputChange = (blankIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[blankIndex] = value;
    onAnswerChange(newAnswers);
  };

  // Split question text by blanks (assuming blanks are marked with _____)
  const parts = question.text.split("_____");

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="mx-2 px-3 py-1 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-transparent min-w-[120px] text-center"
                placeholder="Your answer"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

// Question Component
const QuestionCard = ({ question, currentAnswer, onAnswerChange }) => {
  const renderQuestionContent = () => {
    switch (question.answerType) {
      case "OneCorrect":
        return (
          <SingleChoiceQuestion
            question={question}
            selectedAnswer={currentAnswer}
            onAnswerChange={onAnswerChange}
          />
        );
      case "MultipleChoice":
        return (
          <MultipleChoiceQuestion
            question={question}
            selectedAnswers={currentAnswer || []}
            onAnswerChange={onAnswerChange}
          />
        );
      case "TrueFalse":
        return (
          <TrueFalseQuestion
            question={question}
            selectedAnswer={currentAnswer}
            onAnswerChange={onAnswerChange}
          />
        );
      case "FillTheBlank":
        return (
          <FillBlankQuestion
            question={question}
            answers={currentAnswer || []}
            onAnswerChange={onAnswerChange}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.body}
        </h2>
        {question.answerType === "MultipleChoice" && (
          <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Select all correct answers
          </p>
        )}
      </div>
      {renderQuestionContent()}
    </div>
  );
};

// Quiz Taking Page Component
export const QuizTakingPage = ({ quiz, onFinish, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeDuration);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  //console.log("first question", currentQuestion);
  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = useCallback(() => {
    onFinish(answers, timeLeft);
  }, [answers, onFinish]);

  const handleAnswerChange = (answer) => {
    console.log("ANSWER: ", answer);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]:
        answer === true || answer === false ? answer.toString() : answer,
    }));
  };

  const convertAnswersToListModel = (answers) => {
    const result = [];
    console.log("Converting answers to list model:", answers);
    Object.entries(answers).map(([questionId, text]) => {
      if (Array.isArray(text)) {
        text.forEach((singleText) => {
          result.push(
            new Answer({
              text: singleText || "",
              questionId: parseInt(questionId, 10),
            })
          );
        });
      } else {
        result.push(
          new Answer({
            text: text || "",
            questionId: parseInt(questionId, 10),
          })
        );
      }
    });

    return result;
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // const handlePrevious = () => {
  //   if (currentQuestionIndex > 0) {
  //     setCurrentQuestionIndex((prev) => prev - 1);
  //   }
  // };

  const handleFinishQuiz = () => {
    const modelAnswers = convertAnswersToListModel(answers);
    console.log("Submitting answers:", modelAnswers);
    console.log("time left:", timeLeft);
    onFinish(modelAnswers, timeLeft);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Quizzes
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.name}</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Timer
              timeLeft={timeLeft}
              totalTime={quiz.timeDuration}
              onTimeUp={handleTimeUp}
            />
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span>
              {getAnsweredCount()} of {totalQuestions} answered
            </span>
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          currentAnswer={answers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {/* <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button> */}

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmFinish(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Finish Quiz
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Finish Confirmation Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Finish Quiz?
            </h3>
            <p className="text-gray-600 mb-6">
              You have answered {getAnsweredCount()} out of {totalQuestions}{" "}
              questions. Are you sure you want to finish the quiz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleFinishQuiz}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Finish Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Results Page Component
export const ResultsPage = ({
  quiz,
  answers,
  onRetakeQuiz,
  onBackToQuizzes,
}) => {
  // Calculate results
  const calculateResults = () => {
    let correctAnswers = 0;
    const detailedResults = [];
    console.log("answersssss:", answers);

    let wonPoints = 0;

    quiz.questions.forEach((question) => {
      //const userAnswer = answers[question.id];
      const userAnswer = answers
        .filter((a) => a.questionId === question.id)
        .map((a) => a.text);
      let isCorrect = false;

      const correctAnswersForQuestion = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.text);

      console.log("Correct answers for question:", correctAnswersForQuestion);

      console.log("User answer for question:", userAnswer);

      switch (question.answerType) {
        case "OneCorrect":
        case "TrueFalse":
          // isCorrect = Array.isArray(userAnswer)
          //   ? userAnswer.every((ans) =>
          //       correctAnswersForQuestion
          //         .toLowerCase()
          //         .includes(ans.toLowerCase())
          //     )
          //   : correctAnswersForQuestion.includes(userAnswer);

          isCorrect = Array.isArray(userAnswer)
            ? userAnswer.every((ans) =>
                correctAnswersForQuestion.some(
                  (correctAns) => correctAns.toLowerCase() === ans.toLowerCase()
                )
              )
            : correctAnswersForQuestion.includes(userAnswer);

          break;
        case "MultipleChoice":
          if (Array.isArray(userAnswer)) {
            const correctSet = new Set(correctAnswersForQuestion);
            const userSet = new Set(userAnswer || []);
            isCorrect =
              correctSet.size === userSet.size &&
              [...correctSet].every((x) => userSet.has(x));
          } else {
            isCorrect = false;
          }
          break;
        case "FillTheBlank":
          if (Array.isArray(userAnswer)) {
            isCorrect = correctAnswersForQuestion.every(
              (correct, index) =>
                userAnswer[index] &&
                userAnswer[index].toLowerCase().trim() ===
                  correct.toLowerCase().trim()
            );
          } else {
            isCorrect = false;
          }
          break;

        default:
          isCorrect = false;
      }

      if (isCorrect) {
        correctAnswers++;
        wonPoints = wonPoints + question.points;
      }
      detailedResults.push({
        question,
        userAnswer,
        isCorrect,
        correctAnswers: correctAnswersForQuestion,
      });
    });

    const percentage = Math.round((correctAnswers / quiz.quizPoints) * 100);

    console.log("Detailed results:", detailedResults);
    return {
      correct: correctAnswers,
      total: quiz.questions.length,
      percentage,
      detailedResults,
    };
  };

  const results = calculateResults();

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (percentage) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatUserAnswer = (question, userAnswer) => {
    console.log("User answer:", userAnswer);
    console.log("question", question);
    if (
      userAnswer === undefined ||
      userAnswer === null ||
      (Array.isArray(userAnswer) && userAnswer.length === 0) ||
      userAnswer === ""
    ) {
      return "No answer";
    }
    switch (question.answerType) {
      case "OneCorrect":
        return userAnswer || "No answer";
      case "MultipleChoice":
        if (Array.isArray(userAnswer) && userAnswer.length > 0) {
          return userAnswer.join(",");
        } else {
          return "No answer";
        }
      case "TrueFalse":
        if (typeof userAnswer === "string") {
          return userAnswer.toLowerCase() === "true" ? "True" : "False";
        }
        return userAnswer ? "True" : "False";
      case "FillTheBlank":
        if (Array.isArray(userAnswer)) {
          return userAnswer.length > 0 ? userAnswer.join(", ") : "No answer";
        }
        return userAnswer || "No answer";
      default:
        return "No answer";
    }
  };

  const formatCorrectAnswer = (question) => {
    const correctAnswers = question.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.text);

    switch (question.answerType) {
      case "OneCorrect":
        return correctAnswers.length > 0 ? correctAnswers[0] : "No answer";
      case "MultipleChoice":
        return correctAnswers.length > 0 ? correctAnswers.join(", ") : "N/A";
      case "TrueFalse":
        return correctAnswers.length > 0 ? correctAnswers[0] : "No answer";
      case "FillTheBlank":
        return correctAnswers.length > 0
          ? correctAnswers.join(", ")
          : "No answer";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="mb-6">
            <Trophy
              className={`w-16 h-16 mx-auto mb-4 ${getScoreColor(
                results.percentage
              )}`}
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quiz Complete!
            </h1>
            <h2 className="text-xl text-gray-600">{quiz.name}</h2>
          </div>

          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(
              results.percentage
            )} mb-6`}
          >
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  results.percentage
                )}`}
              >
                {results.percentage}%
              </div>
              <div className="text-sm text-gray-600">
                {results.correct}/{results.total}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.correct}
              </div>
              <div className="text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {results.total - results.correct}
              </div>
              <div className="text-gray-600">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {results.total}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRetakeQuiz}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={onBackToQuizzes}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Quizzes
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Answer Review
          </h3>

          <div className="space-y-6">
            {results.detailedResults.map((result, index) => (
              <div
                key={result.question.id}
                className={`p-6 rounded-lg border-2 ${
                  result.isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex-1">
                    {index + 1}. {result.question.body}
                  </h4>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isCorrect ? "Correct" : "Incorrect"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Your Answer:
                    </div>
                    <div
                      className={
                        result.isCorrect ? "text-green-700" : "text-red-700"
                      }
                    >
                      {formatUserAnswer(result.question, result.userAnswer)}
                    </div>
                  </div>

                  {!result.isCorrect && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Correct Answer:
                      </div>
                      <div className="text-green-700">
                        {formatCorrectAnswer(result.question)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Quiz System Component
const QuizSystem = () => {
  const [currentPage, setCurrentPage] = useState("main"); // main, taking, results
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Sample quiz data with questions
  const sampleQuizzes = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      questions: 3,
      difficulty: "beginner",
      timeLimit: 5, // 5 minutes for demo
      theme: "programming",
      description:
        "Test your knowledge of JavaScript basics including variables, functions, and arrays.",
      questions: [
        {
          id: 1,
          type: "single",
          text: "What is the correct way to declare a variable in JavaScript?",
          options: [
            "var myVar;",
            "variable myVar;",
            "v myVar;",
            "declare myVar;",
          ],
          correctAnswer: 0,
        },
        {
          id: 2,
          type: "multiple",
          text: "Which of the following are JavaScript data types?",
          options: ["String", "Number", "Boolean", "Character"],
          correctAnswers: [0, 1, 2],
        },
        {
          id: 3,
          type: "trueFalse",
          text: "JavaScript is a statically typed language.",
          correctAnswer: false,
        },
      ],
    },
    {
      id: 2,
      name: "React Basics",
      questions: 2,
      difficulty: "intermediate",
      timeLimit: 3,
      theme: "programming",
      description: "Learn React fundamentals and JSX syntax.",
      questions: [
        {
          id: 4,
          type: "fillBlank",
          text: "In React, _____ are used to pass data from parent to child components, while _____ is used to manage component internal data.",
          correctAnswers: ["props", "state"],
        },
        {
          id: 5,
          type: "single",
          text: "What does JSX stand for?",
          options: [
            "JavaScript XML",
            "Java Syntax Extension",
            "JavaScript Extension",
            "Java XML",
          ],
          correctAnswer: 0,
        },
      ],
    },
  ];

  const handleStartQuiz = (quizId) => {
    const quiz = sampleQuizzes.find((q) => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setCurrentPage("taking");
      setQuizAnswers({});
    }
  };

  const handleFinishQuiz = (answers, timeLeft) => {
    setQuizAnswers(answers);
    setCurrentPage("results");
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setCurrentPage("taking");
  };

  const handleBackToQuizzes = () => {
    setCurrentPage("main");
    setSelectedQuiz(null);
    setQuizAnswers({});
  };

  // Render based on current page
  switch (currentPage) {
    case "taking":
      return (
        <QuizTakingPage
          quiz={selectedQuiz}
          onFinish={handleFinishQuiz}
          onBack={handleBackToQuizzes}
        />
      );
    case "results":
      return (
        <ResultsPage
          quiz={selectedQuiz}
          answers={quizAnswers}
          onRetakeQuiz={handleRetakeQuiz}
          onBackToQuizzes={handleBackToQuizzes}
        />
      );
    default:
      // Import the QuizHubMain component here or create a simple quiz list
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Quiz Hub
              </h1>
              <p className="text-gray-600 text-lg">
                Choose a quiz to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {quiz.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{quiz.questions.length} questions</span>
                    <span>{quiz.timeDuration} minutes</span>
                    <span className="capitalize">{quiz.difficulty}</span>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
  }
};

export default QuizSystem;

export {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  QuestionCard,
  Timer,
  ProgressBar,
  //QuizTakingPage,
  //ResultsPage,
};
