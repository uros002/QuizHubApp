import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Check,
  X,
  BookOpen,
  Clock,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Navbar from "../Navbar";
import { Quiz, Question, Answer, QuizDifficulty, AnswerType } from "../Models";
import { createQuiz } from "../Service";

const QuizCreatePage2 = ({ onSave, onCancel }) => {
  // Quiz basic information state
  const [quizData, setQuizData] = useState({
    name: "",
    description: "",
    difficulty: QuizDifficulty.Easy,
    category: "",
    timeLimit: 15,
  });

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [newQuestion, setNewQuestion] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle quiz basic info changes
  const handleQuizChange = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Map internal question types to AnswerType enum
  const mapQuestionTypeToAnswerType = (type) => {
    switch (type) {
      case "single":
        return AnswerType.OneCorrect;
      case "multiple":
        return AnswerType.MultipleChoice;
      case "trueFalse":
        return AnswerType.TrueFalse;
      case "fillBlank":
        return AnswerType.FillTheBlank;
      default:
        return AnswerType.OneCorrect;
    }
  };

  // Add new question template
  const handleAddQuestion = (type) => {
    const newQuestionTemplate = {
      id: Date.now(),
      type: type,
      text: "",
      points: 1, // Default points
      options:
        type === "single" || type === "multiple" ? ["", "", "", ""] : undefined,
      correctAnswer:
        type === "single" ? 0 : type === "trueFalse" ? true : undefined,
      correctAnswers:
        type === "multiple" ? [] : type === "fillBlank" ? [""] : undefined,
    };
    setNewQuestion(newQuestionTemplate);
  };

  // Save new question
  const handleSaveNewQuestion = (newQuestion) => {
    if (validateQuestion(newQuestion)) {
      setQuestions((prev) => [...prev, newQuestion]);
      setNewQuestion(null);
    }
  };

  // Update existing question
  const handleUpdateQuestion = (questionId, updatedQuestion) => {
    if (validateQuestion(updatedQuestion)) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? updatedQuestion : q))
      );
      setEditingQuestionId(null);
    }
  };

  // Delete question
  const handleDeleteQuestion = (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  // Validate question
  const validateQuestion = (question) => {
    if (!question.text.trim()) {
      alert("Question text is required!");
      return false;
    }

    if (question.type === "single" || question.type === "multiple") {
      const hasEmptyOptions = question.options.some((opt) => !opt.trim());
      if (hasEmptyOptions) {
        alert("All answer options must be filled!");
        return false;
      }

      if (
        question.type === "multiple" &&
        (!question.correctAnswers || question.correctAnswers.length === 0)
      ) {
        alert(
          "Please select at least one correct answer for multiple choice questions!"
        );
        return false;
      }
    }

    if (question.type === "fillBlank") {
      const hasEmptyAnswers = question.correctAnswers.some(
        (ans) => !ans.trim()
      );
      if (hasEmptyAnswers) {
        alert("All correct answers must be filled!");
        return false;
      }
    }

    return true;
  };

  // Validate entire quiz
  const validateQuiz = () => {
    const newErrors = {};

    if (!quizData.name.trim()) {
      newErrors.name = "Quiz name is required";
    }

    if (!quizData.description.trim()) {
      newErrors.description = "Quiz description is required";
    }

    if (!quizData.category.trim()) {
      newErrors.category = "Quiz category is required";
    }

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert internal question format to Quiz model format
  const convertQuestionsToModels = (questions) => {
    return questions.map((q, index) => {
      // Create answers based on question type
      let answers = [];

      if (q.type === "single" || q.type === "multiple") {
        answers = q.options.map((option, optIndex) => {
          let isCorrect = false;

          if (q.type === "single") {
            isCorrect = q.correctAnswer === optIndex;
          } else if (q.type === "multiple") {
            isCorrect = q.correctAnswers?.includes(optIndex) || false;
          }

          return new Answer({
            text: option,
            isCorrect: isCorrect,
            //questionId: index, // Will be set properly by backend
          });
        });
      } else if (q.type === "trueFalse") {
        answers = [
          new Answer({
            text: "True",
            isCorrect: q.correctAnswer === true,
            // questionId: index,
          }),
          new Answer({
            text: "False",
            isCorrect: q.correctAnswer === false,
            //questionId: index,
          }),
        ];
      } else if (q.type === "fillBlank") {
        // For fill in the blank, we store correct answers
        answers = q.correctAnswers.map(
          (answer) =>
            new Answer({
              text: answer,
              isCorrect: true,
              //questionId: index,
            })
        );
      }

      return new Question({
        body: q.text,
        answers: answers,
        answerType: mapQuestionTypeToAnswerType(q.type),
        points: q.points || 1,
        //quizId: 0, // Will be set by backend
      });
    });
  };

  // Save quiz
  const handleSaveQuiz = async () => {
    if (!validateQuiz()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert questions to proper model format
      const convertedQuestions = convertQuestionsToModels(questions);

      // Create Quiz object
      const quiz = new Quiz({
        name: quizData.name,
        numOfQuestions: questions.length,
        timeDuration: quizData.timeLimit * 60, // Convert minutes to seconds
        description: quizData.description,
        difficulty: quizData.difficulty,
        category: quizData.category,
        questions: convertedQuestions,
      });

      console.log("Creating quiz with data:", quiz);

      // Send to API using the service
      const result = await createQuiz(quiz);

      console.log("Quiz created successfully:", result);

      // Show success message
      alert("Quiz created successfully!");

      // Call onSave callback if provided
      if (onSave) {
        onSave(result);
      } else {
        // Reset form
        setQuizData({
          name: "",
          description: "",
          difficulty: QuizDifficulty.Easy,
          category: "",
          timeLimit: 15,
        });
        setQuestions([]);
        setErrors({});
      }
    } catch (error) {
      console.error("Failed to create quiz:", error);
      alert(`Failed to create quiz: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Question Editor Component
  const QuestionEditor = ({ question, isNew = false, onSave, onCancel }) => {
    const [localQuestion, setLocalQuestion] = useState({ ...question });

    const updateLocalQuestion = (field, value) => {
      setLocalQuestion((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      console.log(localQuestion.text || "Untitled question");
      onSave(localQuestion);
    };

    return (
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
              {question.type === "single"
                ? "Single Choice"
                : question.type === "multiple"
                ? "Multiple Choice"
                : question.type === "trueFalse"
                ? "True/False"
                : "Fill in the Blank"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            value={localQuestion.text}
            onChange={(e) => updateLocalQuestion("text", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="Enter your question here..."
          />
        </div>

        {/* Points */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points
          </label>
          <input
            type="number"
            value={localQuestion.points || 1}
            onChange={(e) =>
              updateLocalQuestion("points", parseInt(e.target.value) || 1)
            }
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="1"
            max="10"
          />
        </div>

        {/* Options for Single/Multiple Choice */}
        {(question.type === "single" || question.type === "multiple") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            {localQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <div className="flex items-center">
                  {question.type === "single" ? (
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={localQuestion.correctAnswer === index}
                      onChange={() =>
                        updateLocalQuestion("correctAnswer", index)
                      }
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={
                        localQuestion.correctAnswers?.includes(index) || false
                      }
                      onChange={(e) => {
                        const currentAnswers =
                          localQuestion.correctAnswers || [];
                        if (e.target.checked) {
                          updateLocalQuestion("correctAnswers", [
                            ...currentAnswers,
                            index,
                          ]);
                        } else {
                          updateLocalQuestion(
                            "correctAnswers",
                            currentAnswers.filter((i) => i !== index)
                          );
                        }
                      }}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...localQuestion.options];
                    newOptions[index] = e.target.value;
                    updateLocalQuestion("options", newOptions);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              {question.type === "single"
                ? "Select the correct answer"
                : "Select all correct answers"}
            </p>
          </div>
        )}

        {/* True/False Options */}
        {question.type === "trueFalse" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`trueFalse-${question.id}`}
                  checked={localQuestion.correctAnswer === true}
                  onChange={() => updateLocalQuestion("correctAnswer", true)}
                  className="text-indigo-600 focus:ring-indigo-500 mr-2"
                />
                True
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`trueFalse-${question.id}`}
                  checked={localQuestion.correctAnswer === false}
                  onChange={() => updateLocalQuestion("correctAnswer", false)}
                  className="text-indigo-600 focus:ring-indigo-500 mr-2"
                />
                False
              </label>
            </div>
          </div>
        )}

        {/* Fill in the Blank */}
        {question.type === "fillBlank" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answers *{" "}
              <span className="text-xs text-gray-500">
                (use ___ in question text for blanks)
              </span>
            </label>
            {(localQuestion.correctAnswers || [""]).map((answer, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [
                      ...(localQuestion.correctAnswers || [""]),
                    ];
                    newAnswers[index] = e.target.value;
                    updateLocalQuestion("correctAnswers", newAnswers);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Answer ${index + 1}`}
                />
                {(localQuestion.correctAnswers || []).length > 1 && (
                  <button
                    onClick={() => {
                      const newAnswers = (
                        localQuestion.correctAnswers || []
                      ).filter((_, i) => i !== index);
                      updateLocalQuestion("correctAnswers", newAnswers);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const currentAnswers = localQuestion.correctAnswers || [""];
                updateLocalQuestion("correctAnswers", [...currentAnswers, ""]);
              }}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              + Add another answer
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Quiz
                </h1>
                <p className="text-gray-600">
                  Design your quiz and add questions
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveQuiz}
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quiz Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Name *
                  </label>
                  <input
                    type="text"
                    value={quizData.name}
                    onChange={(e) => handleQuizChange("name", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter quiz name"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) =>
                      handleQuizChange("description", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    rows="4"
                    placeholder="Describe your quiz"
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    value={quizData.difficulty}
                    onChange={(e) =>
                      handleQuizChange("difficulty", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    <option value={QuizDifficulty.Easy}>Easy</option>
                    <option value={QuizDifficulty.Medium}>Medium</option>
                    <option value={QuizDifficulty.Hard}>Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={quizData.category}
                    onChange={(e) =>
                      handleQuizChange("category", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.category ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g., programming, history, science"
                    disabled={isSubmitting}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes) *
                  </label>
                  <input
                    type="number"
                    value={quizData.timeLimit}
                    onChange={(e) =>
                      handleQuizChange(
                        "timeLimit",
                        parseInt(e.target.value) || 15
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    max="180"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        <strong>Questions:</strong> {questions.length}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        <strong>Duration:</strong> {quizData.timeLimit} min
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>
                        <strong>Difficulty:</strong> {quizData.difficulty}
                      </span>
                    </p>
                  </div>
                  {errors.questions && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.questions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Questions
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleAddQuestion("single")}
                    className="px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    + Single Choice
                  </button>
                  <button
                    onClick={() => handleAddQuestion("multiple")}
                    className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => handleAddQuestion("trueFalse")}
                    className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    + True/False
                  </button>
                  <button
                    onClick={() => handleAddQuestion("fillBlank")}
                    className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    + Fill Blank
                  </button>
                </div>
              </div>

              {/* New Question Editor */}
              {newQuestion && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    New Question
                  </h3>
                  <QuestionEditor
                    question={newQuestion}
                    isNew={true}
                    onSave={handleSaveNewQuestion}
                    onCancel={() => setNewQuestion(null)}
                  />
                </div>
              )}

              {/* Existing Questions */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editingQuestionId === question.id ? (
                      <QuestionEditor
                        question={question}
                        onSave={(updatedQuestion) =>
                          handleUpdateQuestion(question.id, updatedQuestion)
                        }
                        onCancel={() => setEditingQuestionId(null)}
                      />
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                              {question.type === "single"
                                ? "Single Choice"
                                : question.type === "multiple"
                                ? "Multiple Choice"
                                : question.type === "trueFalse"
                                ? "True/False"
                                : "Fill in the Blank"}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {question.points || 1} pts
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingQuestionId(question.id)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              disabled={isSubmitting}
                            >
                              <Plus className="h-4 w-4 rotate-45" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-900 font-medium">
                            {question.text || "Untitled question"}
                          </p>
                        </div>

                        {/* Show options preview */}
                        {(question.type === "single" ||
                          question.type === "multiple") &&
                          question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                  <div
                                    className={`w-4 h-4 rounded ${
                                      (question.type === "single" &&
                                        question.correctAnswer === optIndex) ||
                                      (question.type === "multiple" &&
                                        question.correctAnswers?.includes(
                                          optIndex
                                        ))
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                  <span>
                                    {option || `Option ${optIndex + 1}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {question.type === "trueFalse" && (
                          <div className="text-sm text-gray-600">
                            <span>Correct answer: </span>
                            <span className="font-medium text-green-600">
                              {question.correctAnswer ? "True" : "False"}
                            </span>
                          </div>
                        )}

                        {question.type === "fillBlank" &&
                          question.correctAnswers && (
                            <div className="text-sm text-gray-600">
                              <span>Correct answers: </span>
                              <span className="font-medium text-green-600">
                                {question.correctAnswers.join(", ")}
                              </span>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {questions.length === 0 && !newQuestion && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first question to get started.
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => handleAddQuestion("single")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      Add Single Choice
                    </button>
                    <button
                      onClick={() => handleAddQuestion("multiple")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      Add Multiple Choice
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreatePage2;
