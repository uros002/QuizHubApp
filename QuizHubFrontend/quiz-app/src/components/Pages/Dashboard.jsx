import React, { useState, useMemo, useContext } from "react";
import {
  Search,
  Filter,
  Clock,
  BookOpen,
  Star,
  Play,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  ArrowLeft,
  Check,
} from "lucide-react";

import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  QuestionCard,
  Timer,
  ProgressBar,
  QuizTakingPage,
  ResultsPage,
} from "./QuizTakingPage";
import Navbar from "../Navbar";
import AuthContext from "../../context/AuthContext";

// Header Component
const QuizHubHeader = ({
  title = "QuizHub",
  subtitle = "Test your knowledge with our curated collection of quizzes",
}) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {title.includes("Hub") ? (
          <>
            {title.split("Hub")[0]}
            <span className="text-indigo-600">Hub</span>
          </>
        ) : (
          title
        )}
      </h1>
      <p className="text-gray-600 text-lg">{subtitle}</p>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search quizzes by name or keywords...",
}) => {
  return (
    <div className="relative flex-1 w-full lg:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
      />
    </div>
  );
};

// Dropdown Filter Component
const DropdownFilter = ({
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  icon: Icon,
  minWidth = "140px",
}) => {
  const formatOption = (option) => {
    if (option === "all") return `All ${label}s`;
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm justify-between"
        style={{ minWidth }}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">{formatOption(value)}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className="block w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              {formatOption(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Difficulty Stars Component
const DifficultyStars = ({ difficulty }) => {
  const starCount = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  return (
    <div className="flex gap-1">
      {Array.from({ length: 3 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < starCount ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// Difficulty Badge Component
const DifficultyBadge = ({ difficulty }) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatText = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
        difficulty
      )}`}
    >
      {formatText(difficulty)}
    </span>
  );
};

// Quiz Stats Component
const QuizStats = ({ questions, timeLimit }) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <BookOpen className="h-4 w-4" />
        <span>
          {questions} question{questions !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{timeLimit} min</span>
      </div>
    </div>
  );
};

// Theme Badge Component
const ThemeBadge = ({ theme }) => {
  const formatTheme = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-medium rounded-full">
      {formatTheme(theme)}
    </span>
  );
};

// Start Quiz Button Component
const StartQuizButton = ({ onStart, disabled = false }) => {
  return (
    <button
      onClick={onStart}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Play className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      Start Quiz
    </button>
  );
};

// View Quiz Button Component
const ViewQuizButton = ({ onView, disabled = false }) => {
  return (
    <button
      onClick={onView}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Play className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      View Quiz
    </button>
  );
};

// Quiz Card Component
const QuizCard = ({ quiz, onStartQuiz, onViewQuiz }) => {
  const handleStart = () => {
    onStartQuiz(quiz.id);
  };

  const handleView = () => {
    onViewQuiz(quiz.id);
  };

  const authContext = useContext(AuthContext);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 group">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex items-start justify-between mb-2">
          <ThemeBadge theme={quiz.theme} />
          <DifficultyStars difficulty={quiz.difficulty} />
        </div>
        <h3 className="text-white font-bold text-lg leading-tight group-hover:text-opacity-90 transition-all">
          {quiz.name}
        </h3>
      </div>

      {/* Quiz Content */}
      <div className="p-6">
        {/* Quiz Stats */}
        <div className="flex items-center justify-between mb-4">
          <QuizStats
            questions={quiz.NumOfQuestions}
            timeLimit={quiz.timeLimit}
          />
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <DifficultyBadge difficulty={quiz.difficulty} />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {quiz.description}
        </p>

        {/* Start Button */}
        {authContext.userType === "Admin" ? (
          <ViewQuizButton onView={handleView} />
        ) : (
          <StartQuizButton onStart={handleStart} />
        )}
      </div>
    </div>
  );
};

// Results Counter Component
const ResultsCounter = ({ count, searchTerm }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-600">
        Showing <span className="font-semibold text-gray-900">{count}</span>{" "}
        quiz{count !== 1 ? "es" : ""}
        {searchTerm && (
          <span>
            {" "}
            for "
            <span className="font-semibold text-indigo-600">{searchTerm}</span>"
          </span>
        )}
      </p>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onClearFilters, searchTerm, hasFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No quizzes found
      </h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search terms or filters to find what you're looking
        for.
      </p>
      {(searchTerm || hasFilters) && (
        <button
          onClick={onClearFilters}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

// Quiz Grid Component
const QuizGrid = ({ quizzes, onStartQuiz, onViewQuiz }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onStartQuiz={onStartQuiz}
          onViewQuiz={onViewQuiz}
        />
      ))}
    </div>
  );
};

// Filter Bar Component
const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedTheme,
  onThemeChange,
  selectedDifficulty,
  onDifficultyChange,
  themes,
  difficulties,
  showThemeDropdown,
  showDifficultyDropdown,
  onToggleThemeDropdown,
  onToggleDifficultyDropdown,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <DropdownFilter
        label="Theme"
        value={selectedTheme}
        options={themes}
        onChange={(theme) => {
          onThemeChange(theme);
          onToggleThemeDropdown(false);
        }}
        isOpen={showThemeDropdown}
        onToggle={() => {
          onToggleThemeDropdown(!showThemeDropdown);
          onToggleDifficultyDropdown(false);
        }}
        icon={Filter}
      />

      <DropdownFilter
        label="Level"
        value={selectedDifficulty}
        options={difficulties}
        onChange={(difficulty) => {
          onDifficultyChange(difficulty);
          onToggleDifficultyDropdown(false);
        }}
        isOpen={showDifficultyDropdown}
        onToggle={() => {
          onToggleDifficultyDropdown(!showDifficultyDropdown);
          onToggleThemeDropdown(false);
        }}
        icon={Star}
      />
    </div>
  );
};

// Quiz View/Edit Page Component
const QuizViewPage = ({ quiz, onSave, onBack }) => {
  const [editingQuiz, setEditingQuiz] = useState({ ...quiz });
  const [editingQuestions, setEditingQuestions] = useState([...quiz.questions]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [newQuestion, setNewQuestion] = useState(null);
  const [isQuizModified, setIsQuizModified] = useState(false);

  // Handle quiz basic info changes
  const handleQuizChange = (field, value) => {
    setEditingQuiz((prev) => ({ ...prev, [field]: value }));
    setIsQuizModified(true);
  };

  // Handle question changes
  const handleQuestionChange = (questionId, field, value) => {
    setEditingQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    );
    setIsQuizModified(true);
  };

  // Add new question
  const handleAddQuestion = (type) => {
    const newQuestionTemplate = {
      id: Date.now(),
      type: type,
      text: "",
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
  const handleSaveNewQuestion = () => {
    if (newQuestion.text.trim()) {
      setEditingQuestions((prev) => [...prev, newQuestion]);
      setNewQuestion(null);
      setIsQuizModified(true);
    }
  };

  // Delete question
  const handleDeleteQuestion = (questionId) => {
    setEditingQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setIsQuizModified(true);
  };

  // Save all changes
  const handleSaveQuiz = () => {
    const updatedQuiz = {
      ...editingQuiz,
      questions: editingQuestions,
      NumOfQuestions: editingQuestions.length,
    };
    onSave(updatedQuiz);
    setIsQuizModified(false);
  };

  // Question Editor Component
  const QuestionEditor = ({ question, isNew = false }) => {
    const [localQuestion, setLocalQuestion] = useState(question);

    const updateLocalQuestion = (field, value) => {
      setLocalQuestion((prev) => ({ ...prev, [field]: value }));
    };

    const saveQuestion = () => {
      if (isNew) {
        setNewQuestion(localQuestion);
      } else {
        handleQuestionChange(question.id, "text", localQuestion.text);
        if (localQuestion.options) {
          handleQuestionChange(question.id, "options", localQuestion.options);
        }
        if (localQuestion.correctAnswer !== undefined) {
          handleQuestionChange(
            question.id,
            "correctAnswer",
            localQuestion.correctAnswer
          );
        }
        if (localQuestion.correctAnswers !== undefined) {
          handleQuestionChange(
            question.id,
            "correctAnswers",
            localQuestion.correctAnswers
          );
        }
        setEditingQuestionId(null);
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
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
              onClick={saveQuestion}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (isNew) {
                  setNewQuestion(null);
                } else {
                  setEditingQuestionId(null);
                }
              }}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text
          </label>
          <textarea
            value={localQuestion.text}
            onChange={(e) => updateLocalQuestion("text", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="Enter your question here..."
          />
        </div>

        {/* Options for Single/Multiple Choice */}
        {(question.type === "single" || question.type === "multiple") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options
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
          </div>
        )}

        {/* True/False Options */}
        {question.type === "trueFalse" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
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
              Correct Answers (use ___ in question text for blanks)
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
                <p className="text-gray-600">
                  Manage quiz details and questions
                </p>
              </div>
            </div>
            {isQuizModified && (
              <button
                onClick={handleSaveQuiz}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            )}
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
                    Quiz Name
                  </label>
                  <input
                    type="text"
                    value={editingQuiz.name}
                    onChange={(e) => handleQuizChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingQuiz.description}
                    onChange={(e) =>
                      handleQuizChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={editingQuiz.difficulty}
                    onChange={(e) =>
                      handleQuizChange("difficulty", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <input
                    type="text"
                    value={editingQuiz.theme}
                    onChange={(e) => handleQuizChange("theme", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={editingQuiz.timeLimit}
                    onChange={(e) =>
                      handleQuizChange("timeLimit", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Total Questions:</strong>{" "}
                      {editingQuestions.length}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {isQuizModified ? "Modified" : "Saved"}
                    </p>
                  </div>
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddQuestion("single")}
                    className="px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    + Single Choice
                  </button>
                  <button
                    onClick={() => handleAddQuestion("multiple")}
                    className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => handleAddQuestion("trueFalse")}
                    className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    + True/False
                  </button>
                  <button
                    onClick={() => handleAddQuestion("fillBlank")}
                    className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
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
                  <QuestionEditor question={newQuestion} isNew={true} />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNewQuestion}
                      disabled={!newQuestion.text.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Question
                    </button>
                    <button
                      onClick={() => setNewQuestion(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Questions */}
              <div className="space-y-4">
                {editingQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editingQuestionId === question.id ? (
                      <QuestionEditor question={question} />
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
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingQuestionId(question.id)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                        {/* Show options for choice questions */}
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

                        {/* Show answer for true/false */}
                        {question.type === "trueFalse" && (
                          <div className="text-sm text-gray-600">
                            <span>Correct answer: </span>
                            <span className="font-medium text-green-600">
                              {question.correctAnswer ? "True" : "False"}
                            </span>
                          </div>
                        )}

                        {/* Show answers for fill in the blank */}
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

              {editingQuestions.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first question to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main QuizHub Component
const QuizHubMain = ({
  quizzes: propQuizzes,
  onStartQuiz: propOnStartQuiz,
  title = "QuizHub",
  subtitle = "Test your knowledge with our curated collection of quizzes",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);

  const path = window.location.pathname.replace("/", "");
  const [currentPage, setCurrentPage] = useState(path || "main"); // main, taking, results
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Default sample data if no quizzes are provided
  // const sampleQuizzes = [
  //   {
  //     id: 1,
  //     name: "JavaScript Fundamentals",
  //     NumOfQuestions: 15,
  //     difficulty: "beginner",
  //     timeLimit: 20,
  //     theme: "programming",
  //     description:
  //       "Test your knowledge of JavaScript basics including variables, functions, arrays, and DOM manipulation. Perfect for beginners starting their web development journey.",
  //     questions: [
  //       {
  //         id: 1,
  //         type: "single",
  //         text: "What is the correct way to declare a variable in JavaScript?",
  //         options: [
  //           "var myVar;",
  //           "variable myVar;",
  //           "v myVar;",
  //           "declare myVar;",
  //         ],
  //         correctAnswer: 0,
  //       },
  //       {
  //         id: 2,
  //         type: "multiple",
  //         text: "Which of the following are JavaScript data types?",
  //         options: ["String", "Number", "Boolean", "Character"],
  //         correctAnswers: [0, 1, 2],
  //       },
  //       {
  //         id: 3,
  //         type: "trueFalse",
  //         text: "JavaScript is a statically typed language.",
  //         correctAnswer: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "React Advanced Concepts",
  //     questions: 25,
  //     difficulty: "advanced",
  //     timeLimit: 35,
  //     theme: "programming",
  //     description:
  //       "Deep dive into React hooks, context API, performance optimization, and advanced patterns. For experienced React developers.",
  //   },
  //   {
  //     id: 3,
  //     name: "World Geography",
  //     questions: 30,
  //     difficulty: "intermediate",
  //     timeLimit: 25,
  //     theme: "geography",
  //     description:
  //       "Explore countries, capitals, rivers, mountains, and continents. Test your knowledge of world geography and cultures.",
  //   },
  //   {
  //     id: 4,
  //     name: "Python Data Structures",
  //     questions: 20,
  //     difficulty: "intermediate",
  //     timeLimit: 30,
  //     theme: "programming",
  //     description:
  //       "Master Python lists, dictionaries, sets, tuples, and advanced data manipulation techniques for better programming skills.",
  //   },
  //   {
  //     id: 5,
  //     name: "Ancient History",
  //     questions: 18,
  //     difficulty: "advanced",
  //     timeLimit: 40,
  //     theme: "history",
  //     description:
  //       "Journey through ancient civilizations including Egypt, Greece, Rome, and Mesopotamia. Discover the foundations of human civilization.",
  //   },
  //   {
  //     id: 6,
  //     name: "Basic Mathematics",
  //     questions: 12,
  //     difficulty: "beginner",
  //     timeLimit: 15,
  //     theme: "mathematics",
  //     description:
  //       "Fundamental math concepts including arithmetic, basic algebra, geometry, and problem-solving techniques for students.",
  //   },
  //   {
  //     id: 7,
  //     name: "Modern Physics",
  //     questions: 22,
  //     difficulty: "advanced",
  //     timeLimit: 45,
  //     theme: "science",
  //     description:
  //       "Quantum mechanics, relativity theory, particle physics, and modern scientific discoveries that shaped our understanding of the universe.",
  //   },
  //   {
  //     id: 8,
  //     name: "Web Development Basics",
  //     questions: 16,
  //     difficulty: "beginner",
  //     timeLimit: 25,
  //     theme: "programming",
  //     description:
  //       "HTML, CSS, and JavaScript fundamentals for creating responsive websites. Introduction to web development concepts and best practices.",
  //   },
  // ];

  const sampleQuizzes = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      NumOfQuestions: 15,
      difficulty: "beginner",
      timeLimit: 20,
      theme: "programming",
      description:
        "Test your knowledge of JavaScript basics including variables, functions, arrays, and DOM manipulation. Perfect for beginners starting their web development journey.",
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
        {
          id: 4,
          type: "fillBlank",
          text: "The ___ method is used to add elements to the end of an array, while ___ removes the last element.",
          correctAnswers: ["push", "pop"],
        },
      ],
    },
    {
      id: 2,
      name: "React Advanced Concepts",
      NumOfQuestions: 25,
      difficulty: "advanced",
      timeLimit: 35,
      theme: "programming",
      description:
        "Deep dive into React hooks, context API, performance optimization, and advanced patterns. For experienced React developers.",
      questions: [
        {
          id: 5,
          type: "single",
          text: "Which hook is used for managing complex state logic in React?",
          options: ["useState", "useEffect", "useReducer", "useCallback"],
          correctAnswer: 2,
        },
        {
          id: 6,
          type: "multiple",
          text: "Which of the following are React lifecycle methods?",
          options: [
            "componentDidMount",
            "componentWillUpdate",
            "render",
            "useState",
          ],
          correctAnswers: [0, 1, 2],
        },
      ],
    },
    {
      id: 3,
      name: "World Geography",
      NumOfQuestions: 30,
      difficulty: "intermediate",
      timeLimit: 25,
      theme: "geography",
      description:
        "Explore countries, capitals, rivers, mountains, and continents. Test your knowledge of world geography and cultures.",
      questions: [
        {
          id: 7,
          type: "single",
          text: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctAnswer: 2,
        },
        {
          id: 8,
          type: "trueFalse",
          text: "The Nile River is the longest river in the world.",
          correctAnswer: true,
        },
      ],
    },
  ];

  // Sample quiz data with questions
  // const sampleQuizzes = [
  //   {
  //     id: 1,
  //     name: "JavaScript Fundamentals",
  //     questions: 3,
  //     difficulty: "beginner",
  //     timeLimit: 5, // 5 minutes for demo
  //     theme: "programming",
  //     description:
  //       "Test your knowledge of JavaScript basics including variables, functions, and arrays.",
  //     questions: [
  //       {
  //         id: 1,
  //         type: "single",
  //         text: "What is the correct way to declare a variable in JavaScript?",
  //         options: [
  //           "var myVar;",
  //           "variable myVar;",
  //           "v myVar;",
  //           "declare myVar;",
  //         ],
  //         correctAnswer: 0,
  //       },
  //       {
  //         id: 2,
  //         type: "multiple",
  //         text: "Which of the following are JavaScript data types?",
  //         options: ["String", "Number", "Boolean", "Character"],
  //         correctAnswers: [0, 1, 2],
  //       },
  //       {
  //         id: 3,
  //         type: "trueFalse",
  //         text: "JavaScript is a statically typed language.",
  //         correctAnswer: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "React Basics",
  //     questions: 2,
  //     difficulty: "intermediate",
  //     timeLimit: 3,
  //     theme: "programming",
  //     description: "Learn React fundamentals and JSX syntax.",
  //     questions: [
  //       {
  //         id: 4,
  //         type: "fillBlank",
  //         text: "In React, _____ are used to pass data from parent to child components, while _____ is used to manage component internal data.",
  //         correctAnswers: ["props", "state"],
  //       },
  //       {
  //         id: 5,
  //         type: "single",
  //         text: "What does JSX stand for?",
  //         options: [
  //           "JavaScript XML",
  //           "Java Syntax Extension",
  //           "JavaScript Extension",
  //           "Java XML",
  //         ],
  //         correctAnswer: 0,
  //       },
  //     ],
  //   },
  // ];

  const quizzes = propQuizzes || sampleQuizzes;

  // Extract unique themes and difficulties from quizzes
  const themes = ["all", ...new Set(quizzes.map((quiz) => quiz.theme))];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  // Filter and search logic
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTheme =
        selectedTheme === "all" || quiz.theme === selectedTheme;
      const matchesDifficulty =
        selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;

      return matchesSearch && matchesTheme && matchesDifficulty;
    });
  }, [searchTerm, selectedTheme, selectedDifficulty, quizzes]);

  // const handleStartQuiz = (quizId) => {
  //   if (propOnStartQuiz) {
  //     propOnStartQuiz(quizId);
  //   } else {
  //     console.log(`Starting quiz with ID: ${quizId}`);
  //     alert(`Starting quiz ${quizId}!`);
  //   }
  // };

  const handleStartQuiz = (quizId) => {
    const quiz = sampleQuizzes.find((q) => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setCurrentPage("taking");
      setQuizAnswers({});
    }
  };

  const handleViewQuiz = (quizId) => {
    const quiz = sampleQuizzes.find((q) => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setCurrentPage("viewing");
      setQuizAnswers({});
    }
  };

  const handleSaveQuiz = (updatedQuiz) => {
    // Here you would typically save to your backend
    console.log("Saving quiz:", updatedQuiz);
    // For now, just update the sample data
    const quizIndex = sampleQuizzes.findIndex((q) => q.id === updatedQuiz.id);
    if (quizIndex !== -1) {
      sampleQuizzes[quizIndex] = updatedQuiz;
    }
    // Go back to main page after saving
    setCurrentPage("main");
    setSelectedQuiz(null);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTheme("all");
    setSelectedDifficulty("all");
  };

  const handleFinishQuiz = (answers) => {
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

  const hasFilters = selectedTheme !== "all" || selectedDifficulty !== "all";
  // Render based on current page
  switch (currentPage) {
    case "taking":
      return (
        <div>
          <Navbar />
          <QuizTakingPage
            quiz={selectedQuiz}
            onFinish={handleFinishQuiz}
            onBack={handleBackToQuizzes}
          />
        </div>
      );
    case "results":
      return (
        <div>
          <Navbar />
          <ResultsPage
            quiz={selectedQuiz}
            answers={quizAnswers}
            onRetakeQuiz={handleRetakeQuiz}
            onBackToQuizzes={handleBackToQuizzes}
          />
        </div>
      );
    case "viewing":
      return (
        <div>
          <Navbar />
          <QuizViewPage quiz={selectedQuiz} onBack={handleBackToQuizzes} />
        </div>
      );
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <Navbar />
          {/* Header */}
          <div className="bg-white shadow-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <QuizHubHeader title={title} subtitle={subtitle} />

              <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                themes={themes}
                difficulties={difficulties}
                showThemeDropdown={showThemeDropdown}
                showDifficultyDropdown={showDifficultyDropdown}
                onToggleThemeDropdown={setShowThemeDropdown}
                onToggleDifficultyDropdown={setShowDifficultyDropdown}
              />
            </div>
          </div>

          {/* Quiz Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <ResultsCounter
              count={filteredQuizzes.length}
              searchTerm={searchTerm}
            />

            {filteredQuizzes.length > 0 ? (
              <QuizGrid
                quizzes={filteredQuizzes}
                onStartQuiz={handleStartQuiz}
                onViewQuiz={handleViewQuiz}
                onSaveQuiz={handleSaveQuiz}
              />
            ) : (
              <EmptyState
                onClearFilters={handleClearFilters}
                searchTerm={searchTerm}
                hasFilters={hasFilters}
              />
            )}
          </div>

          {/* Click outside to close dropdowns */}
          {(showThemeDropdown || showDifficultyDropdown) && (
            <div
              className="fixed inset-0 z-5"
              onClick={() => {
                setShowThemeDropdown(false);
                setShowDifficultyDropdown(false);
              }}
            />
          )}
        </div>
      );
  }
};

// Export all components
export default QuizHubMain;
export {
  QuizHubHeader,
  SearchBar,
  DropdownFilter,
  DifficultyStars,
  DifficultyBadge,
  QuizStats,
  ThemeBadge,
  StartQuizButton,
  QuizCard,
  ResultsCounter,
  EmptyState,
  QuizGrid,
  FilterBar,
};
