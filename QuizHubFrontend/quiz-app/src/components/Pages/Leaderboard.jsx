import React, { useState, useEffect, useContext, use } from "react";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Clock,
  Target,
  X,
  Star,
  Calendar,
  TrendingUp,
  User,
  Crown,
} from "lucide-react";
import Navbar from "../Navbar";
import AuthContext from "../../context/AuthContext";
import {
  getAllQuizzesForResults,
  getAllResults,
  getAllQuizzes,
  getAllUsers,
} from "../Service";

// Main Leaderboard Page Component
const LeaderboardPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesForDisplay, setQuizzesForDisplay] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    loadQuizzesAndResults();
  }, []);

  function UserProfile({ user }) {
    return (
      <div className="flex flex-col items-center">
        {user.profileImageBase64 ? (
          <img
            src={`data:image/png;base64,${user.profileImageBase64}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}
        <p className="mt-2 font-semibold">{user.username}</p>
      </div>
    );
  }

  const loadQuizzesAndResults = async () => {
    try {
      setLoading(true);
      const response = await getAllQuizzesForResults();
      setQuizzes(response || []);

      console.log("All Quizzes: -> ", response);

      const responsequizzesForDisplay = await getAllQuizzes();
      setQuizzesForDisplay(responsequizzesForDisplay || []);
      console.log(" Quizzes for display: -> ", responsequizzesForDisplay);

      const responseResults = await getAllResults();
      setResults(responseResults || []);

      console.log("All Results: -> ", responseResults);

      const responseUsers = await getAllUsers();
      setUsers(responseUsers);
      console.log("All users: ", responseUsers);
    } catch (err) {
      setError("Failed to load quizzes");
      console.error("Error loading quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeaderboard = async (quiz) => {
    try {
      setSelectedQuiz(quiz);
      setIsModalOpen(true);
      setModalLoading(true);

      // Call API to get leaderboard for this quiz
      //const leaderboard = await getLeaderboard(quiz.id);

      const newLeaderboard = results.map((result) => {
        const quiz = quizzes.find((q) => q.id === result.quizId) || {};
        const parentQuiz = quizzes.find((q) => q.id === quiz.parentQuiz);
        const user = users.find((u) => parseInt(u.id) === result.userId);

        return {
          ...result,
          username: user ? user.username : "Unknown",
          quiz,
        };
      });

      // example: get leaderboard for ONE parent quiz

      const leaderboard = newLeaderboard.filter(
        (result) => result.quiz.parentQuiz === quiz.id
      );

      console.log("LEADERBOARD:", leaderboard);

      // Process and rank the leaderboard data
      const processedData = processLeaderboardData(leaderboard);
      console.log("ProcessedData: ", processLeaderboardData);
      setLeaderboardData(processedData);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setLeaderboardData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const processLeaderboardData = (data) => {
    if (!data || !Array.isArray(data)) return [];

    // Sort by points (descending), then by time duration (ascending) for ties
    const sorted = data.sort((a, b) => {
      if (b.points === a.points) {
        return a.timeDuration - b.timeDuration; // Less time is better
      }
      return b.points - a.points; // Higher points is better
    });

    // Add rank and calculate percentage
    return sorted.map((result, index) => ({
      ...result,
      rank: index + 1,
      percentage: selectedQuiz
        ? //? Math.round((result.points / getTotalQuizPoints(selectedQuiz)) * 100)
          Math.round((result.points / selectedQuiz.quizPoints) * 100)
        : 0,
    }));
  };

  const getTotalQuizPoints = (quiz) => {
    if (!quiz.questions || !Array.isArray(quiz.questions)) return 0;
    return quiz.questions.reduce(
      (total, question) => total + (question.points || 1),
      0
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
    setLeaderboardData([]);
  };

  // Filter logic
  const themes = [
    "All Themes",
    ...new Set(quizzesForDisplay.map((quiz) => quiz.category).filter(Boolean)),
  ];
  const difficulties = ["All Difficulties", "Easy", "Medium", "Hard"];

  const filteredQuizzes = quizzesForDisplay.filter((quiz) => {
    const matchesSearch =
      quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme =
      selectedTheme === "All Themes" || quiz.category === selectedTheme;
    const matchesDifficulty =
      selectedDifficulty === "All Difficulties" ||
      quiz.difficulty === selectedDifficulty;

    return matchesSearch && matchesTheme && matchesDifficulty;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTheme("All Themes");
    setSelectedDifficulty("All Difficulties");
  };

  const hasFilters =
    searchTerm ||
    selectedTheme !== "All Themes" ||
    selectedDifficulty !== "All Difficulties";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading leaderboards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadQuizzesAndResults}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <QuizHubHeader
            title="Quiz Leaderboards"
            subtitle="Compete with others and see who's at the top!"
          />

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
          type="leaderboard"
        />

        {filteredQuizzes.length > 0 ? (
          <LeaderboardGrid
            quizzes={filteredQuizzes}
            onViewLeaderboard={handleViewLeaderboard}
          />
        ) : (
          <EmptyState
            onClearFilters={handleClearFilters}
            searchTerm={searchTerm}
            hasFilters={hasFilters}
            type="leaderboard"
          />
        )}
      </div>

      {/* Leaderboard Modal */}
      {isModalOpen && (
        <LeaderboardModal
          quiz={selectedQuiz}
          leaderboardData={leaderboardData}
          loading={modalLoading}
          onClose={closeModal}
        />
      )}

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
};

// Header Component
const QuizHubHeader = ({ title, subtitle }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center mb-4">
      <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h1>
    </div>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

// Filter Bar Component (same as dashboard)
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
}) => (
  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
    {/* Search Bar */}
    <div className="relative flex-1 max-w-md">
      <input
        type="text"
        placeholder="Search leaderboards..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
      />
      <Trophy className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>

    {/* Filter Dropdowns */}
    <div className="flex gap-3">
      {/* Theme Filter */}
      <div className="relative">
        <button
          onClick={() => onToggleThemeDropdown(!showThemeDropdown)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="text-sm font-medium">{selectedTheme}</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showThemeDropdown && (
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  onThemeChange(theme);
                  onToggleThemeDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
              >
                {theme}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty Filter */}
      <div className="relative">
        <button
          onClick={() => onToggleDifficultyDropdown(!showDifficultyDropdown)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="text-sm font-medium">{selectedDifficulty}</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showDifficultyDropdown && (
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => {
                  onDifficultyChange(difficulty);
                  onToggleDifficultyDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
              >
                {difficulty}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Results Counter Component
const ResultsCounter = ({ count, searchTerm, type = "quiz" }) => (
  <div className="mb-6">
    <p className="text-gray-600">
      {searchTerm ? (
        <>
          Showing <span className="font-semibold text-indigo-600">{count}</span>{" "}
          {type}
          {count !== 1 ? "s" : ""} for{" "}
          <span className="font-semibold">"{searchTerm}"</span>
        </>
      ) : (
        <>
          <span className="font-semibold text-indigo-600">{count}</span> {type}
          {count !== 1 ? "s" : ""} available
        </>
      )}
    </p>
  </div>
);

// Leaderboard Grid Component
const LeaderboardGrid = ({ quizzes, onViewLeaderboard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map((quiz) => (
        <LeaderboardCard
          key={quiz.id}
          quiz={quiz}
          onViewLeaderboard={onViewLeaderboard}
        />
      ))}
    </div>
  );
};

// Leaderboard Card Component
const LeaderboardCard = ({ quiz, onViewLeaderboard }) => {
  const handleViewLeaderboard = () => {
    onViewLeaderboard(quiz);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 group">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex items-start justify-between mb-2">
          <ThemeBadge theme={quiz.category} />
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
            questions={quiz.numOfQuestions}
            timeLimit={quiz.timeDuration / 60} // Convert seconds to minutes
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

        {/* View Leaderboard Button */}
        <ViewLeaderboardButton onView={handleViewLeaderboard} />
      </div>
    </div>
  );
};

// View Leaderboard Button Component
const ViewLeaderboardButton = ({ onView }) => (
  <button
    onClick={onView}
    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  >
    <Trophy className="h-5 w-5" />
    View Leaderboard
  </button>
);

// Leaderboard Modal Component
// const LeaderboardModal = ({ quiz, leaderboardData, loading, onClose }) => {
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
//   };

//   const getRankIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <Crown className="h-6 w-6 text-yellow-500" />;
//       case 2:
//         return <Medal className="h-6 w-6 text-gray-400" />;
//       case 3:
//         return <Award className="h-6 w-6 text-orange-600" />;
//       default:
//         return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
//     }
//   };

//   const getRankBadgeColor = (rank) => {
//     switch (rank) {
//       case 1:
//         return "bg-gradient-to-r from-yellow-400 to-yellow-600";
//       case 2:
//         return "bg-gradient-to-r from-gray-300 to-gray-500";
//       case 3:
//         return "bg-gradient-to-r from-orange-400 to-orange-600";
//       default:
//         return "bg-gradient-to-r from-indigo-400 to-indigo-600";
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//         {/* Modal Header */}
//         <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
//                 <Trophy className="h-6 w-6" />
//                 Leaderboard
//               </h2>
//               <p className="text-yellow-100">{quiz?.name}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//           {loading ? (
//             <div className="text-center py-12">
//               <Trophy className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
//               <p className="text-gray-600">Loading leaderboard...</p>
//             </div>
//           ) : leaderboardData.length === 0 ? (
//             <div className="text-center py-12">
//               <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No Results Yet
//               </h3>
//               <p className="text-gray-500">Be the first to take this quiz!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Top 3 Podium */}
//               {leaderboardData.length >= 3 && (
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
//                     🏆 Top Performers 🏆
//                   </h3>
//                   <div className="flex justify-center items-end gap-4 mb-6">
//                     {/* Second Place */}
//                     {leaderboardData[1] && (
//                       <div className="text-center">
//                         <div className="bg-gray-200 rounded-lg p-4 h-20 flex items-end justify-center">
//                           <Medal className="h-8 w-8 text-gray-400" />
//                         </div>
//                         <div className="mt-2">
//                           <p className="font-semibold text-sm">
//                             {leaderboardData[1].username || "Anonymous"}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {leaderboardData[1].points} pts
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* First Place */}
//                     {leaderboardData[0] && (
//                       <div className="text-center">
//                         <div className="bg-yellow-200 rounded-lg p-4 h-24 flex items-end justify-center">
//                           <Crown className="h-10 w-10 text-yellow-600" />
//                         </div>
//                         <div className="mt-2">
//                           <p className="font-bold text-sm">
//                             {leaderboardData[0].username || "Anonymous"}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {leaderboardData[0].points} pts
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Third Place */}
//                     {leaderboardData[2] && (
//                       <div className="text-center">
//                         <div className="bg-orange-200 rounded-lg p-4 h-16 flex items-end justify-center">
//                           <Award className="h-7 w-7 text-orange-600" />
//                         </div>
//                         <div className="mt-2">
//                           <p className="font-semibold text-sm">
//                             {leaderboardData[2].username || "Anonymous"}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {leaderboardData[2].points} pts
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Full Leaderboard List */}
//               <div className="space-y-2">
//                 {leaderboardData.map((result, index) => (
//                   <div
//                     key={result.id || index}
//                     className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
//                       index < 3
//                         ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md"
//                         : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       {/* Rank */}
//                       <div
//                         className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${getRankBadgeColor(
//                           result.rank
//                         )}`}
//                       >
//                         {index < 3 ? (
//                           getRankIcon(result.rank)
//                         ) : (
//                           <span className="font-bold">#{result.rank}</span>
//                         )}
//                       </div>

//                       {/* User Info */}
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <User className="h-4 w-4 text-gray-500" />
//                           <span className="font-semibold text-gray-900">
//                             {result?.username || "Anonymus"}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
//                           <div className="flex items-center gap-1">
//                             <Target className="h-4 w-4" />
//                             <span>{result.points} points</span>
//                           </div>
//                           {/* <div className="flex items-center gap-1">
//                             <TrendingUp className="h-4 w-4" />
//                             <span>{result.percentage}%</span>
//                           </div> */}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Time and Date */}
//                     <div className="text-right">
//                       <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
//                         <Clock className="h-4 w-4" />
//                         <span>{formatTime(result.timeDuration)}</span>
//                       </div>
//                       <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
//                         <Calendar className="h-3 w-3" />
//                         <span>
//                           {new Date(
//                             result.dateOfCompletition
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// Enhanced LeaderboardModal Component with Time Filters
const LeaderboardModal = ({ quiz, leaderboardData, loading, onClose }) => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // Initialize filtered data when leaderboardData changes
  useEffect(() => {
    setFilteredData(leaderboardData);
  }, [leaderboardData]);

  // Filter data based on time selection
  useEffect(() => {
    if (!leaderboardData || leaderboardData.length === 0) {
      setFilteredData([]);
      return;
    }

    const now = new Date();
    let filtered = [...leaderboardData];

    switch (timeFilter) {
      case "week":
        // Calculate start of current week (Sunday)
        const currentDate = new Date(now);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0); // Start of Sunday

        // Calculate end of current week (Saturday 23:59:59)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // End of Saturday

        filtered = leaderboardData.filter((result) => {
          const resultDate = new Date(result.dateOfCompletition);
          return resultDate >= startOfWeek && resultDate <= endOfWeek;
        });
        break;

      case "month":
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        filtered = leaderboardData.filter(
          (result) => new Date(result.dateOfCompletition) >= oneMonthAgo
        );
        break;

      case "3months":
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        filtered = leaderboardData.filter(
          (result) => new Date(result.dateOfCompletition) >= threeMonthsAgo
        );
        break;

      case "year":
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        filtered = leaderboardData.filter(
          (result) => new Date(result.dateOfCompletition) >= oneYearAgo
        );
        break;

      case "all":
      default:
        filtered = leaderboardData;
        break;
    }

    // Re-rank the filtered data
    const reranked = filtered
      .sort((a, b) => {
        if (b.points === a.points) {
          return a.timeDuration - b.timeDuration;
        }
        return b.points - a.points;
      })
      .map((result, index) => ({
        ...result,
        rank: index + 1,
        percentage: quiz
          ? Math.round((result.points / quiz.quizPoints) * 100)
          : 0,
      }));

    setFilteredData(reranked);
  }, [timeFilter, leaderboardData, quiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600";
      default:
        return "bg-gradient-to-r from-indigo-400 to-indigo-600";
    }
  };

  const getTimeFilterLabel = (filter) => {
    switch (filter) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "3months":
        return "Last 3 Months";
      case "year":
        return "This Year";
      case "all":
        return "All Time";
      default:
        return "All Time";
    }
  };

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "year", label: "This Year" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                Leaderboard
              </h2>
              <p className="text-yellow-100">{quiz?.name}</p>
            </div>

            {/* Time Filter Dropdown */}
            <div className="relative mx-4">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>{getTimeFilterLabel(timeFilter)}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showTimeDropdown && (
                <div className="absolute top-full mt-1 right-0 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {timeFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTimeFilter(option.value);
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-gray-700 ${
                        timeFilter === option.value
                          ? "bg-indigo-50 text-indigo-600 font-medium"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-3 text-yellow-100 text-sm">
              Showing {filteredData.length} result
              {filteredData.length !== 1 ? "s" : ""}
              {timeFilter !== "all" &&
                ` for ${getTimeFilterLabel(timeFilter).toLowerCase()}`}
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {timeFilter === "all"
                  ? "No Results Yet"
                  : `No Results for ${getTimeFilterLabel(timeFilter)}`}
              </h3>
              <p className="text-gray-500">
                {timeFilter === "all"
                  ? "Be the first to take this quiz!"
                  : `No one has taken this quiz ${getTimeFilterLabel(
                      timeFilter
                    ).toLowerCase()}. Try selecting a different time period.`}
              </p>
              {timeFilter !== "all" && (
                <button
                  onClick={() => setTimeFilter("all")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  View All Time Results
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium (only show if we have at least 3 results) */}
              {filteredData.length >= 3 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Top Performers{" "}
                    {timeFilter !== "all" &&
                      `- ${getTimeFilterLabel(timeFilter)}`}
                  </h3>
                  <div className="flex justify-center items-end gap-4 mb-6">
                    {/* Second Place */}
                    {filteredData[1] && (
                      <div className="text-center">
                        <div className="bg-gray-200 rounded-lg p-4 h-20 flex items-end justify-center">
                          <Medal className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="mt-2">
                          <p className="font-semibold text-sm">
                            {filteredData[1].username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {filteredData[1].points} pts
                          </p>
                        </div>
                      </div>
                    )}

                    {/* First Place */}
                    {filteredData[0] && (
                      <div className="text-center">
                        <div className="bg-yellow-200 rounded-lg p-4 h-24 flex items-end justify-center">
                          <Crown className="h-10 w-10 text-yellow-600" />
                        </div>
                        <div className="mt-2">
                          <p className="font-bold text-sm">
                            {filteredData[0].username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {filteredData[0].points} pts
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Third Place */}
                    {filteredData[2] && (
                      <div className="text-center">
                        <div className="bg-orange-200 rounded-lg p-4 h-16 flex items-end justify-center">
                          <Award className="h-7 w-7 text-orange-600" />
                        </div>
                        <div className="mt-2">
                          <p className="font-semibold text-sm">
                            {filteredData[2].username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {filteredData[2].points} pts
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Leaderboard List */}
              <div className="space-y-2">
                {filteredData.map((result, index) => (
                  <div
                    key={`${result.id || index}-${result.dateOfCompletition}`}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      index < 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${getRankBadgeColor(
                          result.rank
                        )}`}
                      >
                        {index < 3 ? (
                          getRankIcon(result.rank)
                        ) : (
                          <span className="font-bold">#{result.rank}</span>
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {result?.username || "Anonymous"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{result.points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time and Date */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(result.timeDuration)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(
                            result.dateOfCompletition
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside dropdown to close */}
      {showTimeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowTimeDropdown(false)}
        />
      )}
    </div>
  );
};

// Supporting Components (Theme Badge, Difficulty Stars, etc.)
const ThemeBadge = ({ theme }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
    {theme || "General"}
  </span>
);

const DifficultyStars = ({ difficulty }) => {
  const getStarCount = (diff) => {
    switch (diff) {
      case "Easy":
        return 1;
      case "Medium":
        return 2;
      case "Hard":
        return 3;
      default:
        return 1;
    }
  };

  const starCount = getStarCount(difficulty);

  return (
    <div className="flex">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= starCount
              ? "text-yellow-300 fill-current"
              : "text-white text-opacity-30"
          }`}
        />
      ))}
    </div>
  );
};

const QuizStats = ({ questions, timeLimit }) => (
  <div className="flex items-center gap-4 text-gray-600">
    <div className="flex items-center gap-1">
      <span className="font-medium text-sm">{questions}</span>
      <span className="text-xs">questions</span>
    </div>
    <div className="flex items-center gap-1">
      <Clock className="h-4 w-4" />
      <span className="text-xs">{Math.round(timeLimit)} min</span>
    </div>
  </div>
);

const DifficultyBadge = ({ difficulty }) => {
  const getColorClass = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(
        difficulty
      )}`}
    >
      {difficulty}
    </span>
  );
};

const EmptyState = ({
  onClearFilters,
  searchTerm,
  hasFilters,
  type = "quiz",
}) => (
  <div className="text-center py-12">
    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">
      {searchTerm ? `No ${type}s found` : `No ${type}s available`}
    </h3>
    <p className="text-gray-500 mb-6">
      {searchTerm
        ? `We couldn't find any ${type}s matching "${searchTerm}"`
        : `There are no ${type}s available at the moment`}
    </p>
    {hasFilters && (
      <button
        onClick={onClearFilters}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Clear Filters
      </button>
    )}
  </div>
);

export default LeaderboardPage;
