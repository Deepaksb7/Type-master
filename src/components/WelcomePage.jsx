import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProgress, getLastSessionWPM, getUserProgressSession, isSessionUser } from "../utils/userProgressManager";
import "./WelcomePage.css";

export default function WelcomePage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [unlockedLetters, setUnlockedLetters] = useState(0);
    const [highestWPM, setHighestWPM] = useState(0);
    const [lastSessionWPM, setLastSessionWPM] = useState(0);

    useEffect(() => {
        const user = sessionStorage.getItem("username");
        if (!user) {
            navigate("/user-auth");
            return;
        }

        setUsername(user);

        // Function to update stats
        const updateStats = () => {
            // Check if user is new (session-based) or existing (localStorage-based)
            if (isSessionUser(user)) {
                const progress = getUserProgressSession(user);
                setUnlockedLetters(progress.unlockedLetters?.length || 0);
                setHighestWPM(progress.highestWPM || 0);
                setLastSessionWPM(progress.lastSessionWPM || 0);
            } else {
                const progress = getUserProgress(user);
                setUnlockedLetters(progress.unlockedLetters?.length || 0);
                setHighestWPM(progress.highestWPM || 0);

                // Get last completed session WPM
                const lastWPM = getLastSessionWPM(user);
                setLastSessionWPM(lastWPM);
            }
        };

        // Initial update
        updateStats();

        // Force re-render to update stats after changes
        const interval = setInterval(updateStats, 1000); // Update every second

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="welcome-page">
            <div className="welcome-card">
                <div className="welcome-avatar">
                    {username.charAt(0).toUpperCase()}
                </div>
                <h1 className="welcome-title">Welcome back, {username}!</h1>
                <p className="welcome-subtitle">Ready to improve your typing speed?</p>

                <div className="welcome-stats">
                    <div className="stat-box">
                        <div className="stat-icon">🔓</div>
                        <div className="stat-value">{unlockedLetters}/26</div>
                        <div className="stat-label">Letters Unlocked</div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-value">{lastSessionWPM}</div>
                        <div className="stat-label">Last Session WPM</div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-value">{highestWPM}</div>
                        <div className="stat-label">Best WPM</div>
                    </div>
                </div>

                <button
                    className="welcome-btn"
                    onClick={() => navigate("/typing-trainer")}
                >
                    Start Practicing
                </button>
            </div>
        </div>
    );
}
