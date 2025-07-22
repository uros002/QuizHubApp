import LoginForm from "../AuthComponents/LoginComponent";
import RegisterForm from "../AuthComponents/RegisterComponent";
import { useState } from "react";

const LoginPage = () => {
  const [view, setView] = useState("login");

  return (
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
  );
};

export default LoginPage;
