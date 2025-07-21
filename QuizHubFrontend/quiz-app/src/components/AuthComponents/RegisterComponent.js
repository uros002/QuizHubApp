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

import api from "../../ApiMaker"; // Import the API maker

const RegisterForm = ({ onSubmit, onSwitchToLogin, className = "" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [registerData, setRegisterData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateRegister = () => {
    const newErrors = {};

    if (!registerData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!registerData.surname.trim()) {
      newErrors.surname = "Surname is required";
    }

    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!registerData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (registerData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateRegister()) {
      const formData = new FormData();
      //formData.append("name", registerData.name);
      //formData.append("surname", registerData.surname);
      formData.append("email", registerData.email);
      formData.append("username", registerData.username);
      formData.append("password", registerData.password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      onSubmit && onSubmit({ ...registerData, profileImage }, formData);
      try {
        const response = await api.post("api/users/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        localStorage.setItem("token", response.data);
        console.log("Registration successful:", response.data);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
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
          <UserPlus className="w-8 h-8 text-white mr-2" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>
        <p className="text-blue-100 text-center">Join us today</p>
      </div>

      {/* Form Container */}
      <div className="px-8 py-6">
        <div className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300 overflow-hidden">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name and Surname Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="First name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surname
              </label>
              <input
                type="text"
                name="surname"
                value={registerData.surname}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.surname ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Last name"
              />
              {errors.surname && (
                <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
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
                value={registerData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a password"
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
            Create Account
          </button>
        </div>

        {/* Switch Form Link */}
        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
