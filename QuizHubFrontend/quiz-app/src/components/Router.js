import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import AuthContext from "../context/AuthContext";
import React from "react";

const Router = () => {
  const authContext = React.useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={authContext.token ? <Navigate to="/home" /> : <LoginPage />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={authContext.token ? <HomePage /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
