import React from 'react';
import aboutImg from '../assets/aboutImg.png';

export default function AboutSection() {
    return (
        <section className="about-section-modern" id="about">
            <div className="about-img-wrap">
                <img src={aboutImg} alt="Typing Community" className="about-img" />
                <div className="about-community-badge">
                    <div className="community-avatars">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
                        <img src="https://randomuser.me/api/portraits/women/50.jpg" alt="" />
                        <img src="https://randomuser.me/api/portraits/men/78.jpg" alt="" />
                        <span className="community-count">350+</span>
                    </div>
                    <span>Join our active typing community!</span>
                </div>
            </div>
            <div className="about-content-card">
                <h2>Where Typists Thrive & Stories Begin</h2>
                <p>
                    Not just a practice tool—TypingPro is a creative, supportive space
                    crafted for new learners and seasoned typists alike.
                    <br />
                    Track your mastery, join global leaderboards, improve through daily
                    streaks, and share in a warm community.
                </p>
                <button className="about-cta">Read More</button>
                <div className="about-features">
                    <div className="about-feature-card">
                        <span className="feature-icon">🎯</span>
                        <div>
                            <b>Accuracy Focus</b>
                            <p>
                                Smart feedback to help you perfect your typing with
                                confidence.
                            </p>
                        </div>
                    </div>
                    <div className="about-feature-card">
                        <span className="feature-icon">🌍</span>
                        <div>
                            <b>Global Access</b>
                            <p>
                                Accessible typing and progress tracking for all devices,
                                anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
