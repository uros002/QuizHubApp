import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Camera,
  UserPlus,
  LogIn,
} from "lucide-react";

//import "bootstrap/dist/css/bootstrap.min.css";
// import "../../index.css";
import "../../../src/index.css";
import AuthContext from "../../context/AuthContext";
// Login Component
const LoginForm = ({ onSubmit, onSwitchToRegister, className = "" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const authContext = React.useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    const newErrors = {};

    if (!loginData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or username is required";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (validateLogin()) {
      await authContext.login(loginData);
    }
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white mr-2" />
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        </div>
        <p className="text-blue-100 text-center">Sign in to your account</p>
      </div>

      {/* Form Container */}
      <div className="px-8 py-6">
        <div className="space-y-6">
          {/* Email/Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="emailOrUsername"
                value={loginData.emailOrUsername}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.emailOrUsername ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email or username"
              />
            </div>
            {errors.emailOrUsername && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emailOrUsername}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Switch Form Link */}
        {onSwitchToRegister && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
