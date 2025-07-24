import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../ApiMaker";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const loginHandler = async (loginData) => {
    try {
      const response = await api.post("api/users/login", loginData);
      if (
        response.data !== "Password incorrect!" &&
        response.data !== "User does not exist!"
      ) {
        setToken(response.data);
        setError(null);
        localStorage.setItem("token", response.data);
        localStorage.setItem("UsernameError", null);
        localStorage.setItem("PasswordError", null);
        console.log(response.data);
      } else if (response.data === "User does not exist!") {
        setError("Invalid username");
        localStorage.setItem("UsernameError", "Invalid username!");
      } else if (response.data === "Password incorrect!") {
        setError("Password incorrect!");
        localStorage.setItem("PasswordError", "Password incorrect!");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const userType = () => {
    try {
      if (!token) return null;
      const decodedToken = jwtDecode(token);
      return decodedToken.role || "user"; // Default to 'user' if no role is found
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login: loginHandler,
        logout: logoutHandler,
        userType: userType(),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
