import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Clock,
  BookOpen,
  Star,
  Play,
  ChevronDown,
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
  const starCount =
    difficulty === "beginner" ? 1 : difficulty === "intermediate" ? 2 : 3;

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
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
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

// Quiz Card Component
const QuizCard = ({ quiz, onStartQuiz }) => {
  const handleStart = () => {
    onStartQuiz(quiz.id);
  };

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
        <StartQuizButton onStart={handleStart} />
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
const QuizGrid = ({ quizzes, onStartQuiz }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} onStartQuiz={onStartQuiz} />
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
      ],
    },
    {
      id: 2,
      name: "React Advanced Concepts",
      questions: 25,
      difficulty: "advanced",
      timeLimit: 35,
      theme: "programming",
      description:
        "Deep dive into React hooks, context API, performance optimization, and advanced patterns. For experienced React developers.",
    },
    {
      id: 3,
      name: "World Geography",
      questions: 30,
      difficulty: "intermediate",
      timeLimit: 25,
      theme: "geography",
      description:
        "Explore countries, capitals, rivers, mountains, and continents. Test your knowledge of world geography and cultures.",
    },
    {
      id: 4,
      name: "Python Data Structures",
      questions: 20,
      difficulty: "intermediate",
      timeLimit: 30,
      theme: "programming",
      description:
        "Master Python lists, dictionaries, sets, tuples, and advanced data manipulation techniques for better programming skills.",
    },
    {
      id: 5,
      name: "Ancient History",
      questions: 18,
      difficulty: "advanced",
      timeLimit: 40,
      theme: "history",
      description:
        "Journey through ancient civilizations including Egypt, Greece, Rome, and Mesopotamia. Discover the foundations of human civilization.",
    },
    {
      id: 6,
      name: "Basic Mathematics",
      questions: 12,
      difficulty: "beginner",
      timeLimit: 15,
      theme: "mathematics",
      description:
        "Fundamental math concepts including arithmetic, basic algebra, geometry, and problem-solving techniques for students.",
    },
    {
      id: 7,
      name: "Modern Physics",
      questions: 22,
      difficulty: "advanced",
      timeLimit: 45,
      theme: "science",
      description:
        "Quantum mechanics, relativity theory, particle physics, and modern scientific discoveries that shaped our understanding of the universe.",
    },
    {
      id: 8,
      name: "Web Development Basics",
      questions: 16,
      difficulty: "beginner",
      timeLimit: 25,
      theme: "programming",
      description:
        "HTML, CSS, and JavaScript fundamentals for creating responsive websites. Introduction to web development concepts and best practices.",
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
