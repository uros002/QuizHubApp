import LoginForm from "./AuthComponents/LoginComponent";
import RegisterForm from "./AuthComponents/RegisterComponent";
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";

const LoginPage = () => {
  const [view, setView] = useState("login");

  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center">
        {view === "login" ? (
          <LoginForm
            onSubmit={console.log("LOGIN")}
            onSwitchToRegister={() => setView("register")}
          />
        ) : (
          <RegisterForm
            onSubmit={console.log("REGISTER")}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </div>
    </AuthProvider>
  );
};

export default LoginPage;
