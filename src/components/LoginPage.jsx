import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load all registered users from localStorage
        const savedUsers = JSON.parse(localStorage.getItem("typingUsers")) || [];
        setUsers(savedUsers);
    }, []);

    const handleUserSelect = (username) => {
        sessionStorage.setItem("username", username);
        navigate("/welcome");
    };

    const handleDeleteUser = (e, username) => {
        e.stopPropagation(); // Prevent user selection when clicking delete
        setUserToDelete(username);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            // Remove user from typingUsers list
            const updatedUsers = users.filter(user => user !== userToDelete);
            localStorage.setItem("typingUsers", JSON.stringify(updatedUsers));

            // Remove user's progress data
            localStorage.removeItem(`userProgress_${userToDelete}`);

            // Update state
            setUsers(updatedUsers);
        }

        // Close modal
        setShowModal(false);
        setUserToDelete(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setUserToDelete(null);
    };

    const handleAddNewUser = () => {
        navigate("/create-user");
    };

    const handleBack = () => {
        navigate("/user-auth");
    };

    return (
        <div className="login-page">
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
                    <path className="wave-path" fill="url(#gradient2)" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                        <animate attributeName="d" dur="10s" repeatCount="indefinite"
                            values="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                                   M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                                   M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </path>
                    <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
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
            <div className="login-container">
                <div className="login-card">
                    <div className="card-icon">👥</div>
                    <h2>Select Your Account</h2>
                    <p>Choose from registered users or add a new one</p>

                    {users.length > 0 ? (
                        <div className="user-list">
                            {users.map((user, index) => (
                                <div
                                    key={index}
                                    className="user-card"
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => handleDeleteUser(e, user)}
                                        title="Delete user"
                                    >
                                        ×
                                    </button>
                                    <div className="user-avatar">{user.charAt(0).toUpperCase()}</div>
                                    <span className="user-name">{user}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-users">No registered users yet. Create one below!</p>
                    )}

                    <button className="add-user-btn" onClick={handleAddNewUser}>
                        + Add New User
                    </button>

                    <button className="back-btn" onClick={handleBack}>
                        ← Back
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">⚠️</div>
                        <h3>Delete User?</h3>
                        <p>Are you sure you want to delete <strong>"{userToDelete}"</strong>?</p>
                        <p className="modal-warning">This will permanently remove all their progress data.</p>

                        <div className="modal-actions">
                            <button className="modal-btn modal-cancel" onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className="modal-btn modal-delete" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
