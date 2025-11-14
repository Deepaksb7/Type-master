import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DemoTyping from "./components/DemoTyping";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./components/Home";

import TypingTrainer from "./components/TypingTrainer";
import UserAuthPage from "./components/UserAuthPage";
import CreateUserPage from "./components/CreateUserPage";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";
import Profile from "./components/Profile";
import Progress from "./components/Progress";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<DemoTyping />} />
          <Route path="/user-auth" element={<UserAuthPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/typing" element={<TypingTrainer />} />
          <Route
            path="/typing-trainer"
            element={<TypingTrainer onBack={() => window.history.back()} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
