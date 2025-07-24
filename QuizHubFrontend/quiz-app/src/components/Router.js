import { Navigate, Route, Routes } from "react-router-dom";
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

import QuizSystem from "./Pages/QuizTakingPage";

const Router = () => {
  const authContext = React.useContext(AuthContext);

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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
