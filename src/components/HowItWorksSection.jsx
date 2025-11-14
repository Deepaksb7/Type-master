import React from 'react';

export default function HowItWorksSection() {
    return (
        <section className="sub-about-section" id="how-it-works">
            <div className="sub-about-right">
                <h3>Where Connections Turn Into Opportunities</h3>
                <p>
                    Every practice session, challenge, and milestone shared brings you
                    closer to fellow typists worldwide. Whether aiming for speed
                    records, career skills, or personal growth, the right connections
                    unlock unexpected opportunities.
                </p>
                <div className="app-icons">
                    <div className="app-icon app-store">🍎</div>
                    <div className="app-icon google-play">📱</div>
                    <div className="app-icon windows">💻</div>
                </div>
            </div>
            <div className="sub-about-left">
                <h2 className="sub-about-title">
                    <span className="highlight-pink">Connect</span> &{' '}
                    <span className="highlight-orange">Grow</span>
                </h2>
                <div className="sub-about-images">
                    <div className="img-card img-card-top">
                        <img
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="User 1"
                        />
                    </div>
                    <div className="connector-line"></div>
                    <div className="connector-star">⭐</div>
                    <div className="img-card img-card-bottom-left">
                        <img
                            src="https://randomuser.me/api/portraits/women/68.jpg"
                            alt="User 2"
                        />
                    </div>
                    <div className="img-card img-card-bottom-right">
                        <img
                            src="https://randomuser.me/api/portraits/women/21.jpg"
                            alt="User 3"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
