import React, { useEffect, useState } from "react";
import * as jwt from "jwt-decode";
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
      const decodedToken = jwt.jwtDecode(token);
      console.log(" token:", token);
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decodedToken["role"]; // fallback if you ever use plain "role"
      console.log("Decoded token role:", role);
      return role || "user"; // Default to 'user' if no role is found
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = () => {
    try {
      if (!token) return null;
      const decodedToken = jwt.jwtDecode(token);

      const userId =
        decodedToken[
          //"http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] || decodedToken["sub"]; // fallback if you ever use plain "sub"
      console.log("Decoded token userId:", userId);
      return userId || null;
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
        userId: userId(),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
