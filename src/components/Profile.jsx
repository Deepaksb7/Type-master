import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProgress, getUserProgressSession, isSessionUser } from '../utils/userProgressManager';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [unlockedLetters, setUnlockedLetters] = useState([]);
    const [highestWPM, setHighestWPM] = useState(0);
    const [lastSessionWPM, setLastSessionWPM] = useState(0);
    const [createdAt, setCreatedAt] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [totalSessions, setTotalSessions] = useState(0);
    const [avatarColor, setAvatarColor] = useState('#667eea');
    const [showAchievements, setShowAchievements] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem('username');
        if (!user) {
            navigate('/user-auth');
            return;
        }
        setUsername(user);

        // Load user progress
        let progress;
        if (isSessionUser(user)) {
            progress = getUserProgressSession(user);
        } else {
            progress = getUserProgress(user);
        }

        setUnlockedLetters(progress.unlockedLetters || []);
        setHighestWPM(progress.highestWPM || 0);
        setLastSessionWPM(progress.lastSessionWPM || 0);
        setCreatedAt(progress.createdAt);
        setLastUpdated(progress.lastUpdated);
        setTotalSessions(progress.totalSessions || 0);

        // Generate avatar color based on username
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
        const index = user.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        setAvatarColor(colors[index]);
    }, [navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAchievements = () => {
        const achievements = [];
        if (unlockedLetters.length >= 26) achievements.push({ icon: '🏆', title: 'Master Typist', desc: 'Unlocked all letters!' });
        if (highestWPM >= 100) achievements.push({ icon: '⚡', title: 'Speed Demon', desc: 'Reached 100+ WPM!' });
        if (totalSessions >= 50) achievements.push({ icon: '🎯', title: 'Dedicated', desc: '50+ practice sessions!' });
        if (unlockedLetters.length >= 13) achievements.push({ icon: '🔥', title: 'Halfway Hero', desc: 'Unlocked 13+ letters!' });
        return achievements;
    };

    const progressPercentage = Math.round((unlockedLetters.length / 26) * 100);
    const achievements = getAchievements();

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar" style={{ background: `linear-gradient(45deg, ${avatarColor}, ${avatarColor}dd)` }}>
                    <span className="avatar-text">{username.charAt(0).toUpperCase()}</span>
                    <div className="avatar-badge">{progressPercentage}%</div>
                </div>
                <h1 className="profile-title">Profile Dashboard</h1>
                <p className="profile-subtitle">Welcome back, {username}!</p>
                <div className="profile-meta">
                    <span className="meta-item">📅 Joined {formatDate(createdAt)}</span>
                    <span className="meta-item">🎮 {totalSessions} Sessions</span>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="progress-overview">
                <div className="overview-card">
                    <div className="overview-header">
                        <h3>Overall Mastery</h3>
                        <div className="progress-percentage">{progressPercentage}%</div>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="progress-stats">
                        <span>{unlockedLetters.length} of 26 letters unlocked</span>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            {achievements.length > 0 && (
                <div className="achievements-section">
                    <div className="section-header">
                        <h3>Achievements</h3>
                        <button
                            className="toggle-btn"
                            onClick={() => setShowAchievements(!showAchievements)}
                        >
                            {showAchievements ? 'Hide' : 'Show'} ({achievements.length})
                        </button>
                    </div>
                    {showAchievements && (
                        <div className="achievements-grid">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="achievement-card">
                                    <div className="achievement-icon">{achievement.icon}</div>
                                    <div className="achievement-content">
                                        <h4>{achievement.title}</h4>
                                        <p>{achievement.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Stats Grid */}
            <div className="profile-stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">🔓</div>
                    <div className="stat-value">{unlockedLetters.length}/26</div>
                    <div className="stat-label">Letters Unlocked</div>
                    <div className="stat-details">
                        {unlockedLetters.length > 0 ? unlockedLetters.join(', ').toUpperCase() : 'None'}
                    </div>
                    <div className="stat-trend">
                        <span className="trend-icon">📈</span>
                        {progressPercentage}% complete
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">{highestWPM}</div>
                    <div className="stat-label">Highest WPM</div>
                    <div className="stat-details">Personal Best</div>
                    <div className="stat-chart">
                        <div className="mini-bar" style={{ height: `${Math.min(highestWPM / 2, 100)}%` }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-value">{lastSessionWPM}</div>
                    <div className="stat-label">Last Session WPM</div>
                    <div className="stat-details">Most Recent</div>
                    <div className="stat-chart">
                        <div className="mini-bar" style={{ height: `${Math.min(lastSessionWPM / 2, 100)}%` }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{Math.round((unlockedLetters.length / 26) * 100)}%</div>
                    <div className="stat-label">Mastery Level</div>
                    <div className="stat-details">Letters Mastered</div>
                    <div className="stat-chart">
                        <div className="mini-bar" style={{ height: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-value">{totalSessions}</div>
                    <div className="stat-label">Total Sessions</div>
                    <div className="stat-details">Practice Rounds</div>
                    <div className="stat-chart">
                        <div className="mini-bar" style={{ height: `${Math.min(totalSessions / 2, 100)}%` }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-value">{formatDate(lastUpdated)}</div>
                    <div className="stat-label">Last Updated</div>
                    <div className="stat-details">Progress Sync</div>
                </div>
            </div>

            {/* Letter Progress Visualization */}
            <div className="letter-progress-section">
                <h3>Letter Mastery Journey</h3>
                <div className="letter-timeline">
                    {Array.from('abcdefghijklmnopqrstuvwxyz').map((letter, index) => {
                        const isUnlocked = unlockedLetters.includes(letter);
                        const isNext = !isUnlocked && unlockedLetters.length === index;
                        return (
                            <div
                                key={letter}
                                className={`timeline-letter ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'next' : ''}`}
                            >
                                <span className="letter">{letter.toUpperCase()}</span>
                                <span className="letter-index">#{index + 1}</span>
                                {isUnlocked && <div className="unlock-indicator">✓</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="profile-actions">
                <button className="profile-btn primary" onClick={() => navigate('/typing-trainer')}>
                    <span className="btn-icon">⌨️</span>
                    Continue Practicing
                </button>
                <button className="profile-btn secondary" onClick={() => navigate('/progress')}>
                    <span className="btn-icon">📊</span>
                    View Progress
                </button>
                <button className="profile-btn secondary" onClick={() => navigate('/')}>
                    <span className="btn-icon">🏠</span>
                    Back to Home
                </button>
            </div>
        </div>
    );
}
