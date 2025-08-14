import React, { useState, useMemo, useContext, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Trophy,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../Navbar";
import * as Model from "../Models";
import { getMyResults, getAllQuizzesForResults } from "../Service";
import AuthContext from "../../context/AuthContext";

// // Mock data for quiz results
// const mockResults = [
//   {
//     id: 1,
//     quizId: 1,
//     quizName: "JavaScript Fundamentals",
//     theme: "programming",
//     difficulty: "beginner",
//     dateTaken: "2024-01-15",
//     pointsEarned: 85,
//     totalPoints: 100,
//     percentage: 85,
//     timeSpent: 12, // minutes
//     totalQuestions: 15,
//     correctAnswers: 13,
//     questions: [
//       {
//         id: 1,
//         text: "What is the correct way to declare a variable in JavaScript?",
//         userAnswer: "var myVar;",
//         correctAnswer: "var myVar;",
//         isCorrect: true,
//         type: "single",
//       },
//       {
//         id: 2,
//         text: "Which of the following are JavaScript data types?",
//         userAnswer: "String, Number, Boolean",
//         correctAnswer: "String, Number, Boolean",
//         isCorrect: true,
//         type: "multiple",
//       },
//       {
//         id: 3,
//         text: "JavaScript is a statically typed language.",
//         userAnswer: "False",
//         correctAnswer: "False",
//         isCorrect: true,
//         type: "trueFalse",
//       },
//     ],
//   },
//   {
//     id: 2,
//     quizId: 1,
//     quizName: "JavaScript Fundamentals",
//     theme: "programming",
//     difficulty: "beginner",
//     dateTaken: "2024-01-20",
//     pointsEarned: 92,
//     totalPoints: 100,
//     percentage: 92,
//     timeSpent: 10,
//     totalQuestions: 15,
//     correctAnswers: 14,
//     questions: [
//       {
//         id: 1,
//         text: "What is the correct way to declare a variable in JavaScript?",
//         userAnswer: "var myVar;",
//         correctAnswer: "var myVar;",
//         isCorrect: true,
//         type: "single",
//       },
//       {
//         id: 2,
//         text: "Which of the following are JavaScript data types?",
//         userAnswer: "String, Number, Boolean",
//         correctAnswer: "String, Number, Boolean",
//         isCorrect: true,
//         type: "multiple",
//       },
//     ],
//   },
//   {
//     id: 3,
//     quizId: 2,
//     quizName: "React Advanced Concepts",
//     theme: "programming",
//     difficulty: "advanced",
//     dateTaken: "2024-01-18",
//     pointsEarned: 75,
//     totalPoints: 100,
//     percentage: 75,
//     timeSpent: 25,
//     totalQuestions: 20,
//     correctAnswers: 15,
//     questions: [],
//   },
//   {
//     id: 4,
//     quizId: 3,
//     quizName: "World Geography",
//     theme: "geography",
//     difficulty: "intermediate",
//     dateTaken: "2024-01-22",
//     pointsEarned: 68,
//     totalPoints: 100,
//     percentage: 68,
//     timeSpent: 18,
//     totalQuestions: 25,
//     correctAnswers: 17,
//     questions: [],
//   },
//   {
//     id: 5,
//     quizId: 1,
//     quizName: "JavaScript Fundamentals",
//     theme: "programming",
//     difficulty: "beginner",
//     dateTaken: "2024-01-25",
//     pointsEarned: 96,
//     totalPoints: 100,
//     percentage: 96,
//     timeSpent: 9,
//     totalQuestions: 15,
//     correctAnswers: 14,
//     questions: [],
//   },
// ];

// Search Bar Component
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search quiz results..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
      />
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  icon: Icon,
}) => {
  const formatOption = (option) => {
    if (option === "all") return `All ${label}s`;
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm justify-between min-w-[140px]"
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

// Difficulty Badge Component
const DifficultyBadge = ({ difficulty }) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
        difficulty
      )}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
};

// Score Badge Component
const ScoreBadge = ({ percentage }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(
        percentage
      )}`}
    >
      {percentage}%
    </span>
  );
};

// Improvement Indicator Component
const ImprovementIndicator = ({ current, previous }) => {
  if (!previous) return null;

  const improvement = current - previous;
  const isImproved = improvement > 0;
  const isDeclined = improvement < 0;

  if (improvement === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="w-4 h-4" />
        <span className="text-sm">No change</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 ${
        isImproved ? "text-green-600" : "text-red-600"
      }`}
    >
      {isImproved ? (
        <ArrowUp className="w-4 h-4" />
      ) : (
        <ArrowDown className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {Math.abs(improvement)}% {isImproved ? "improved" : "declined"}
      </span>
    </div>
  );
};

// Progress Chart Component
const ProgressChart = ({ data }) => {
  const chartData = data.map((result, index) => ({
    attempt: `Attempt ${index + 1}`,
    score: result.percentage,
    date: new Date(result.dateOfCompletition).toLocaleDateString(),
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-indigo-600" />
        Progress Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="attempt" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
            labelFormatter={(label) => `${label}`}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ fill: "#4f46e5", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Question Review Component
const QuestionReview = ({ result }) => {
  const mergedQuestions = result.correctQuestions.map((q, index) => {
    const userAnswers =
      result.myQuestions
        .find((mq) => mq.parentQuestion === q.id)
        ?.answers.map((a) => a.text) || [];
    const correctAnswers = q.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.text);

    console.log("userAnswers:", userAnswers);

    console.log("correctAnswers:", correctAnswers);

    return {
      id: q.id,
      body: q.body,
      userAnswer: userAnswers || null,
      correctAnswer: correctAnswers || null,
      isCorrect:
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((ans) =>
          userAnswers.some(
            (userAns) => userAns.toLowerCase() === ans.toLowerCase()
          )
        ),
    };
  });

  console.log("mergedQuestions:", mergedQuestions);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        Question Review
      </h3>
      <div className="space-y-4">
        {mergedQuestions.map((question, index) => (
          <div
            key={question.id}
            className={`p-4 rounded-lg border-2 ${
              question.isCorrect
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex-1">
                {index + 1}. {question.body}
              </h4>
              {question.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Your Answer: </span>
                <span
                  className={
                    question.isCorrect ? "text-green-700" : "text-red-700"
                  }
                >
                  {Array.isArray(question.userAnswer)
                    ? question.userAnswer.join(", ")
                    : question.userAnswer || "No answer"}
                </span>
              </div>
              {!question.isCorrect && (
                <div>
                  <span className="font-medium text-gray-700">
                    Correct Answer:{" "}
                  </span>
                  <span className="text-green-700">
                    {Array.isArray(question.correctAnswer)
                      ? question.correctAnswer.join(", ")
                      : question.correctAnswer || "No correct answer"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Result Details Modal Component
const ResultDetailsModal = ({ result, onClose, previousResults }) => {
  const multipleAttempts = previousResults.length > 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {result.quizName}
              </h2>
              <p className="text-gray-600">
                Taken on{" "}
                {new Date(result.dateOfCompletition).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Score</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {result.percentage}%
              </div>
              <div className="text-sm text-gray-600">
                {result.points}/{result.numOfQuestions} points
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Correct
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {result.points}
              </div>
              <div className="text-sm text-gray-600">
                out of {result.numOfQuestions}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Time</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {result.timeDuration}
              </div>
              <div className="text-sm text-gray-600">minutes</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Level</span>
              </div>
              <div className="text-lg font-bold text-yellow-600 capitalize">
                {result.difficulty}
              </div>
              <div className="text-sm text-gray-600">{result.category}</div>
            </div>
          </div>

          {/* Progress Chart (only if multiple attempts) */}
          {multipleAttempts && <ProgressChart data={previousResults} />}

          {/* Question Review (only if questions available) */}
          {result.myQuestions && result.myQuestions.length > 0 && (
            <QuestionReview result={result} />
          )}

          {/* Performance Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Accuracy Rate
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {result.percentage}%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Time Efficiency
                </h4>
                <div className="text-sm text-gray-600">
                  Average:{" "}
                  {Math.round(
                    (result.timeDuration / result.numOfQuestions) * 10
                  ) / 10}{" "}
                  min per question
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Result Card Component
const ResultCard = ({ result, onViewDetails, previousResult }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-medium rounded-full">
              {result.category}
            </span>
            <DifficultyBadge difficulty={result.difficulty} />
          </div>
          <div className="text-right text-white">
            <div className="text-sm opacity-90">
              {new Date(result.dateOfCompletition).toLocaleDateString()}
            </div>
          </div>
        </div>
        <h3 className="text-white font-bold text-lg leading-tight">
          {result.quizName}
        </h3>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Score and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <ScoreBadge percentage={result.percentage} />
              <div className="text-xs text-gray-500 mt-1">
                {result.points}/{result.numOfQuestions} pts
              </div>
            </div>
          </div>

          <div className="text-right">
            <ImprovementIndicator
              current={result.percentage}
              previous={previousResult?.percentage}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium text-gray-900">
              {result.points}/{result.numOfQuestions}
            </div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium text-gray-900">
              {Math.round(result.timeDuration / 60)}m
            </div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Trophy className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium text-gray-900">
              {result.percentage >= 90
                ? "A"
                : result.percentage >= 80
                ? "B"
                : result.percentage >= 70
                ? "C"
                : result.percentage >= 60
                ? "D"
                : "F"}
            </div>
            <div className="text-xs text-gray-500">Grade</div>
          </div>
        </div>

        {/* Details Button */}
        <button
          onClick={() => onViewDetails(result)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
          View Details
        </button>
      </div>
    </div>
  );
};

// Main Results Page Component
const QuizResultsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // date, score, name
  const [results, setResults] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);

  // Extract unique themes and difficulties
  const themes = ["all", ...new Set(results.map((result) => result.category))];
  const difficulties = ["all", "easy", "medium", "hard"];

  const authContext = useContext(AuthContext);

  // Get stats for the summary
  const percentage = (result, quiz) => {
    if (!quiz.numOfQuestions) return 0;

    return Math.round((result.points / quiz.numOfQuestions) * 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzes = await getAllQuizzesForResults();

        setAllQuizzes(quizzes);

        const results = await getMyResults(authContext.userId);

        setResults(results);
        console.log("Fetched quizzes:", quizzes);
        console.log("Fetched results:", results);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchData();
  }, []);

  const mergedResults = useMemo(() => {
    return results.map((result) => {
      const quiz = allQuizzes.find((q) => q.id === result.quizId) || {};

      console.log("FOUND QUIZ: ", quiz);

      const parentQuiz = allQuizzes.find((q) => q.id === quiz.parentQuiz);

      console.log("Parent quiz: ", parentQuiz);

      return {
        ...result,
        quizName: quiz.name || "Unknown Quiz",
        category: quiz.category || "Uncategorized",
        difficulty: quiz.difficulty || "Unknown",
        numOfQuestions: quiz.numOfQuestions || 0,
        myQuestions: quiz.questions,
        correctQuestions: parentQuiz.questions || [],
        percentage: percentage(result, quiz),
        parentQuiz: parentQuiz.id || null,
      };
    });
  }, [results, allQuizzes]);
  console.log(mergedResults);
  // Filter and sort results
  const filteredResults = useMemo(() => {
    let filtered = mergedResults.filter((result) => {
      const matchesSearch = result.quizName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTheme =
        selectedTheme === "all" || result.category === selectedTheme;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        result.difficulty === selectedDifficulty;

      return matchesSearch && matchesTheme && matchesDifficulty;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.percentage - a.percentage;
        case "name":
          return a.quizName.localeCompare(b.quizName);
        case "date":
        default:
          return (
            new Date(b.dateOfCompletition) - new Date(a.dateOfCompletition)
          );
      }
    });

    return filtered;
  }, [mergedResults, searchTerm, selectedTheme, selectedDifficulty, sortBy]);
  console.log("Filtered results: ", filteredResults);
  // Get previous results for the same quiz
  const getPreviousResults = (currentResult) => {
    return mergedResults
      .filter((result) => result.parentQuiz === currentResult.parentQuiz)
      .sort(
        (a, b) =>
          new Date(a.dateOfCompletition) - new Date(b.dateOfCompletition)
      );
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
  };

  const handleCloseDetails = () => {
    setSelectedResult(null);
  };

  console.log("Results:", results);
  const totalQuizzes = filteredResults.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          filteredResults.reduce(
            (sum, result) =>
              sum +
              percentage(
                result,
                allQuizzes.find((q) => q.id === result.quizId)
              ),
            0
          ) / totalQuizzes
        )
      : 0;
  const bestScore =
    totalQuizzes > 0
      ? Math.max(
          ...filteredResults.map((result) =>
            percentage(
              result,
              allQuizzes.find((q) => q.id === result.quizId)
            )
          )
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Quiz <span className="text-indigo-600">Results</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Track your progress and review your quiz performance
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalQuizzes}
                  </div>
                  <div className="text-sm text-gray-600">Quizzes Taken</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {averageScore}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {bestScore}%
                  </div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <FilterDropdown
              label="Theme"
              value={selectedTheme}
              options={themes}
              onChange={(theme) => {
                setSelectedTheme(theme);
                setShowThemeDropdown(false);
              }}
              isOpen={showThemeDropdown}
              onToggle={() => setShowThemeDropdown(!showThemeDropdown)}
              icon={Star}
            />
          </div>
        </div>
      </div>
      {/* Quiz Result Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result, index) => {
          const previousResults = getPreviousResults(result);
          const currentIndex = previousResults.findIndex(
            (r) => r.id === result.id
          );
          const previous = previousResults[currentIndex - 1]; // the last attempt before this one

          return (
            <ResultCard
              key={result.id}
              result={result}
              onViewDetails={handleViewDetails}
              previousResult={previous}
            />
          );
        })}
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <ResultDetailsModal
          result={selectedResult}
          onClose={handleCloseDetails}
          previousResults={getPreviousResults(selectedResult)}
        />
      )}
    </div>
  );
};

export default QuizResultsPage;
