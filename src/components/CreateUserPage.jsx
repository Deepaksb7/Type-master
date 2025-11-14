import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateUserPage.css";

export default function CreateUserPage() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setError("Please enter a username");
            return;
        }

        const trimmedUsername = username.trim();

        // Get existing users array
        const existingUsers = JSON.parse(localStorage.getItem("typingUsers")) || [];

        // Check if user already exists
        if (existingUsers.includes(trimmedUsername)) {
            setError("Username already exists. Please choose another.");
            return;
        }

        // Add new user to the list
        existingUsers.push(trimmedUsername);
        localStorage.setItem("typingUsers", JSON.stringify(existingUsers));

        // ✅ FIXED: Use sessionStorage with "username" key (consistent with LoginPage)
        sessionStorage.setItem("username", trimmedUsername);

        // Initialize user progress in sessionStorage for new users
        const { saveUserProgressSession } = await import("../utils/userProgressManager");
        saveUserProgressSession(trimmedUsername, ['e', 'n', 'i', 'a'], 0, 0);

        navigate("/welcome");
    };

    return (
        <div className="create-user-page">
            {/* UNIQUE Animated Background */}
            <div className="animated-background">
                <div className="morph-blob blob-1"></div>
                <div className="morph-blob blob-2"></div>
                <div className="morph-blob blob-3"></div>

                <div className="geometric-pattern">
                    <div className="geo-shape geo-circle"></div>
                    <div className="geo-shape geo-triangle"></div>
                    <div className="geo-shape geo-square"></div>
                    <div className="geo-shape geo-hexagon"></div>
                </div>

                <svg className="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path className="wave-path" fill="url(#gradient1)" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                        <animate attributeName="d" dur="10s" repeatCount="indefinite"
                            values="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                                   M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                                   M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </path>
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className="gradient-stop-1" />
                            <stop offset="100%" className="gradient-stop-2" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="particle-system">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`particle-trail particle-${i + 1}`}>
                            <span className="particle-dot"></span>
                        </div>
                    ))}
                </div>

                <div className="grid-overlay"></div>
            </div>

            {/* Main Content */}
            <div className="create-user-container">
                <div className="create-user-card">
                    <div className="card-icon">✨</div>
                    <h1>Create Account</h1>
                    <p>Enter your name to get started</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter your username"
                                autoFocus
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="submit-btn">
                            Create Account
                        </button>
                    </form>

                    <button className="back-btn" onClick={() => navigate("/user-auth")}>
                        ← Back
                    </button>
                </div>
            </div>
        </div>
    );
}
