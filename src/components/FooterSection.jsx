import React from 'react';
import logo from '../assets/logo.png';

export default function FooterSection() {
    return (
        <footer className="footer-modern">
            <div className="footer-top">
                <div className='footer-flex'>
                    <div className="footer-heading">
                        Join TypingPro's email list to stay up to date about
                        <br />
                        <b>Modern Typing, Lessons & Competitions in Your Area</b>
                    </div>
                    <form className="footer-subscribe" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <div className="footer-line"></div>
            <div className="footer-main">
                <div className="footer-links-col">
                    <p className="footer-col-title">Contact</p>
                    <span>hello@typingpro.com</span>
                    <span>Main Street, India</span>
                    <span>+91 1234567890</span>
                </div>
                <div className="footer-links-col">
                    <p className="footer-col-title">Explore</p>
                    <span>Typing Games</span>
                    <span>Leaderboard</span>
                    <span>Progress Tracker</span>
                    <span>Portfolio</span>
                </div>
                <div className="footer-links-col">
                    <p className="footer-col-title">About</p>
                    <span>Our Team</span>
                    <span>Careers</span>
                    <span>Blog</span>
                    <span>Contact</span>
                </div>
                <div className="footer-socials">
                    <button title="Facebook" className="footer-social">
                        <span>f</span>
                    </button>
                    <button title="Instagram" className="footer-social">
                        <span>📷</span>
                    </button>
                    <button title="X/Twitter" className="footer-social">
                        <span>𝕏</span>
                    </button>
                    <button title="LinkedIn" className="footer-social">
                        <span>in</span>
                    </button>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-brand">
                    <img src={logo} alt="TypingPro Logo" />
                    <span>TypingPro</span>
                </div>
                <span className="footer-copyright">
                    © TypingPro. All rights reserved. 2025
                </span>
            </div>
        </footer>
    );
}
