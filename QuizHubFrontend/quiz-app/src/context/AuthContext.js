import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../ApiMaker";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [token, setToken] = useState(null);

  const loginHandler = async (loginData) => {
    try {
      const response = await api.post("api/users/login", loginData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
        },
      });
      setToken(response.data);
      localStorage.setItem("token", response.data);
      console.log(response.data);
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
