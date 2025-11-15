import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TypingTrainer from "./TypingTrainer";
import "./DemoTyping.css";

export default function DemoTyping() {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Set demo mode in sessionStorage
        sessionStorage.setItem("isDemoMode", "true");
        sessionStorage.setItem("demoStartTime", Date.now().toString());

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowModal(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    });

    const handleContinue = () => {
        sessionStorage.removeItem("isDemoMode");
        sessionStorage.removeItem("demoStartTime");
        navigate("/user-auth");
    };



    return (
        <div className="demo-typing-page">
            {/* Demo timer is now shown inside TypingTrainer component */}
            <TypingTrainer />

            {/* Modal after 2 minutes */}
            {showModal && (
                <div className="demo-modal-overlay">
                    <div className="demo-modal">
                        <h2>Demo Time Expired! ⏰</h2>
                        <p>Want to continue practicing and track your progress?</p>
                        <p className="modal-subtext">Create an account to unlock unlimited practice sessions!</p>
                        <button className="modal-btn" onClick={handleContinue}>
                            Create Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
