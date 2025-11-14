import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProgress, getUserProgressSession, isSessionUser } from '../utils/userProgressManager';
import './Progress.css';

const DEFAULT_UNLOCK_ORDER = ['e', 'n', 'i', 'a', 'r', 'l', 't', 'o', 's', 'u', 'd', 'y', 'c', 'g', 'h', 'p', 'm', 'k', 'b', 'w', 'f', 'z', 'v', 'x', 'q', 'j'];

export default function Progress() {
    const navigate = useNavigate();
    const [unlockedLetters, setUnlockedLetters] = useState([]);
    const [highestWPM, setHighestWPM] = useState(0);
    const [lastSessionWPM, setLastSessionWPM] = useState(0);
    const [currentWPM, setCurrentWPM] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [totalSessions, setTotalSessions] = useState(0);
    const [wpmHistory, setWpmHistory] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('week');
    const [showDetailedView, setShowDetailedView] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem('username');
        if (!user) {
            navigate('/user-auth');
            return;
        }

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
        setTotalSessions(progress.totalSessions || 0);

        // Generate mock historical data
        generateHistoricalData(progress);
    }, [navigate]);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWPM(prev => Math.max(0, prev + (Math.random() - 0.5) * 5));
            setAccuracy(prev => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 2)));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const generateHistoricalData = (progress) => {
        const sessions = progress.totalSessions || 0;
        const baseWPM = progress.highestWPM || 40;
        const history = [];

        for (let i = 0; i < Math.min(sessions, 30); i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            history.push({
                date: date.toISOString().split('T')[0],
                wpm: Math.max(20, baseWPM - 20 + Math.random() * 40),
                accuracy: Math.max(85, 95 + Math.random() * 5),
                lettersUnlocked: Math.floor((i / 30) * 26)
            });
        }
        setWpmHistory(history);
    };

    const progressPercentage = Math.round((unlockedLetters.length / 26) * 100);
    const nextLetter = DEFAULT_UNLOCK_ORDER.find(letter => !unlockedLetters.includes(letter));

    const getFilteredHistory = () => {
        const now = new Date();
        const days = selectedTimeframe === 'week' ? 7 : selectedTimeframe === 'month' ? 30 : 90;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        return wpmHistory.filter(entry => new Date(entry.date) >= cutoff);
    };

    const filteredHistory = getFilteredHistory();
    const avgWPM = filteredHistory.length > 0 ? Math.round(filteredHistory.reduce((sum, entry) => sum + entry.wpm, 0) / filteredHistory.length) : 0;
    const improvement = filteredHistory.length > 1 ? Math.round(filteredHistory[filteredHistory.length - 1].wpm - filteredHistory[0].wpm) : 0;

    const getLetterMasteryData = () => {
        const letterStats = {};
        DEFAULT_UNLOCK_ORDER.forEach((letter, index) => {
            const isUnlocked = unlockedLetters.includes(letter);
            const daysToUnlock = isUnlocked ? Math.floor((index / 26) * 30) : null;
            letterStats[letter] = {
                unlocked: isUnlocked,
                order: index + 1,
                daysToMaster: daysToUnlock,
                difficulty: index < 10 ? 'easy' : index < 20 ? 'medium' : 'hard'
            };
        });
        return letterStats;
    };

    const letterMasteryData = getLetterMasteryData();

    return (
        <div className="progress-container">
            <div className="progress-header">
                <div className="header-icon">📈</div>
                <h1 className="progress-title">Advanced Progress Analytics</h1>
                <p className="progress-subtitle">Deep insights into your typing journey</p>
                <div className="header-controls">
                    <button
                        className={`view-toggle ${!showDetailedView ? 'active' : ''}`}
                        onClick={() => setShowDetailedView(false)}
                    >
                        Overview
                    </button>
                    <button
                        className={`view-toggle ${showDetailedView ? 'active' : ''}`}
                        onClick={() => setShowDetailedView(true)}
                    >
                        Detailed
                    </button>
                </div>
            </div>

            {!showDetailedView ? (
                <>
                    {/* Performance Overview */}
                    <div className="progress-overview">
                        <div className="overview-card primary">
                            <div className="overview-icon">🎯</div>
                            <div className="overview-content">
                                <h3>Mastery Progress</h3>
                                <div className="progress-ring">
                                    <svg width="120" height="120">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="#e0e0e0"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="url(#progressGradient)"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 50}`}
                                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
                                            transform="rotate(-90 60 60)"
                                        />
                                        <defs>
                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#667eea" />
                                                <stop offset="100%" stopColor="#764ba2" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="progress-text">
                                        <div className="progress-number">{progressPercentage}%</div>
                                        <div className="progress-label">Complete</div>
                                    </div>
                                </div>
                                <div className="next-goal">
                                    <span className="goal-icon">🎯</span>
                                    Next: {nextLetter ? nextLetter.toUpperCase() : 'Master Complete!'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="timeframe-selector">
                        <h3>Performance Trends</h3>
                        <div className="timeframe-buttons">
                            {['week', 'month', 'quarter'].map(timeframe => (
                                <button
                                    key={timeframe}
                                    className={`timeframe-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                                    onClick={() => setSelectedTimeframe(timeframe)}
                                >
                                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="performance-chart">
                        <div className="chart-header">
                            <h3>WPM Progress Over Time</h3>
                            <div className="chart-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Average</span>
                                    <span className="stat-value">{avgWPM} WPM</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Improvement</span>
                                    <span className={`stat-value ${improvement >= 0 ? 'positive' : 'negative'}`}>
                                        {improvement >= 0 ? '+' : ''}{improvement} WPM
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="chart-grid">
                                {filteredHistory.map((entry, index) => (
                                    <div key={index} className="chart-bar">
                                        <div
                                            className="bar-fill"
                                            style={{ height: `${(entry.wpm / 100) * 100}%` }}
                                            title={`${entry.date}: ${Math.round(entry.wpm)} WPM`}
                                        ></div>
                                        <div className="bar-label">
                                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Stats Grid */}
                    <div className="progress-stats-grid">
                        <div className="stat-card live">
                            <div className="stat-icon">⚡</div>
                            <div className="stat-value">{Math.round(currentWPM)}</div>
                            <div className="stat-label">Live WPM</div>
                            <div className="live-pulse"></div>
                            <div className="stat-trend">
                                <span className="trend-indicator">↗</span>
                                Active Session
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-value">{highestWPM}</div>
                            <div className="stat-label">Peak Performance</div>
                            <div className="stat-details">All-time high</div>
                            <div className="achievement-badge">🏆</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-value">{Math.round(accuracy)}%</div>
                            <div className="stat-label">Live Accuracy</div>
                            <div className="live-pulse"></div>
                            <div className="accuracy-bar">
                                <div
                                    className="accuracy-fill"
                                    style={{ width: `${accuracy}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-value">{totalSessions}</div>
                            <div className="stat-label">Total Sessions</div>
                            <div className="stat-details">Practice commitment</div>
                            <div className="session-streak">
                                <span className="streak-icon">🔥</span>
                                Keep it up!
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🔓</div>
                            <div className="stat-value">{unlockedLetters.length}/26</div>
                            <div className="stat-label">Letters Mastered</div>
                            <div className="stat-details">Knowledge unlocked</div>
                            <div className="mastery-progress">
                                <div className="mastery-bar">
                                    <div
                                        className="mastery-fill"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-value">{lastSessionWPM}</div>
                            <div className="stat-label">Last Session</div>
                            <div className="stat-details">Previous performance</div>
                            <div className="comparison">
                                {lastSessionWPM > avgWPM ? 'Above average' : 'Room for growth'}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Detailed View */
                <div className="detailed-view">
                    <div className="detailed-section">
                        <h3>Letter Mastery Analysis</h3>
                        <div className="letter-mastery-grid">
                            {Object.entries(letterMasteryData).map(([letter, data]) => (
                                <div key={letter} className={`mastery-item ${data.unlocked ? 'unlocked' : 'locked'} ${data.difficulty}`}>
                                    <div className="letter-header">
                                        <span className="letter">{letter.toUpperCase()}</span>
                                        <span className="difficulty-badge">{data.difficulty}</span>
                                    </div>
                                    <div className="mastery-details">
                                        <div className="detail-item">
                                            <span>Order:</span>
                                            <span>#{data.order}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>Status:</span>
                                            <span className={data.unlocked ? 'status-unlocked' : 'status-locked'}>
                                                {data.unlocked ? '✓ Mastered' : '🔒 Locked'}
                                            </span>
                                        </div>
                                        {data.daysToMaster && (
                                            <div className="detail-item">
                                                <span>Days to master:</span>
                                                <span>{data.daysToMaster}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mastery-bar">
                                        <div
                                            className="mastery-fill"
                                            style={{ width: data.unlocked ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="detailed-section">
                        <h3>Session History</h3>
                        <div className="session-history">
                            <div className="history-header">
                                <span>Date</span>
                                <span>WPM</span>
                                <span>Accuracy</span>
                                <span>Progress</span>
                            </div>
                            {filteredHistory.slice(-10).reverse().map((session, index) => (
                                <div key={index} className="history-row">
                                    <span>{new Date(session.date).toLocaleDateString()}</span>
                                    <span className="wpm-value">{Math.round(session.wpm)}</span>
                                    <span className="accuracy-value">{Math.round(session.accuracy)}%</span>
                                    <span className="progress-value">{session.lettersUnlocked}/26</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="progress-actions">
                <button className="progress-btn primary" onClick={() => navigate('/typing-trainer')}>
                    <span className="btn-icon">⌨️</span>
                    Start New Session
                </button>
                <button className="progress-btn secondary" onClick={() => navigate('/profile')}>
                    <span className="btn-icon">👤</span>
                    View Profile
                </button>
                <button className="progress-btn secondary" onClick={() => navigate('/settings')}>
                    <span className="btn-icon">⚙️</span>
                    Adjust Settings
                </button>
            </div>
        </div>
    );
}
