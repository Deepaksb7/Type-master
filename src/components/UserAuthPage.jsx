import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAuthPage.css';

export default function UserAuthPage() {
    const navigate = useNavigate();

    return (
        <div className="auth-page">
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
                    <path className="wave-path" fill="url(#gradient)" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                        <animate attributeName="d" dur="10s" repeatCount="indefinite"
                            values="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                     M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                     M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </path>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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

            <div className="auth-container">
                <h1>Welcome to TypingPro</h1>
                <p>Choose how you'd like to get started</p>

                <div className="auth-options">
                    <div className="auth-card" onClick={() => navigate('/create-user')}>
                        <div className="auth-icon">👤</div>
                        <h3>New User</h3>
                        <p>Create a new account and start your typing journey</p>
                    </div>

                    <div className="auth-card" onClick={() => navigate('/login')}>
                        <div className="auth-icon">🔑</div>
                        <h3>Existing User</h3>
                        <p>Log in to continue your progress</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
