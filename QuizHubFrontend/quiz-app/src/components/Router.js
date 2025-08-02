import { useNavigate, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import AuthContext from "../context/AuthContext";
import React from "react";
import QuizHubMain, {
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
} from "./Pages/Dashboard";
import QuizResultsPage from "./Pages/MyResults";
import QuizSystem from "./Pages/QuizTakingPage";
import QuizCreatePage from "./Pages/QuizCreatePage";

const Router = () => {
  const authContext = React.useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={authContext.token ? <Navigate to="/main" /> : <LoginPage />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/main"
        element={authContext.token ? <QuizHubMain /> : <Navigate to="/" />}
      />
      <Route
        path="/my-results"
        element={authContext.token ? <QuizResultsPage /> : <Navigate to="/" />}
      />
      <Route
        path="/create-quiz"
        element={
          authContext.token ? (
            <QuizCreatePage
              onSave={(newQuiz) => {
                // Handle saving the quiz to your backend
                console.log("New quiz created:", newQuiz);
              }}
              onCancel={() => {
                // Handle navigation back
                navigate("/main");
              }}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
