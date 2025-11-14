                                                                  import React, { useState } from 'react';
import './NavigationBar.css';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';

export default function NavigationBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        setMenuOpen(false);

        if (sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const navbar = document.querySelector('.hero-navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="hero-navbar">
            <div className="logo-wrap">
                <img src={logo} alt="TypingPro Logo" />
                <span className="brand-text">TypingPro</span>
            </div>

            <nav className={menuOpen ? 'active' : ''}>
                <button onClick={(e) => handleNavClick(e, 'home')}>Home</button>
                <button onClick={(e) => handleNavClick(e, 'about')}>About</button>
                <button onClick={(e) => handleNavClick(e, 'testimonials')}>Testimonials</button>
                <button onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</button>
                <button onClick={(e) => handleNavClick(e, 'contact')}>Contact</button>
            </nav>

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                <div className="theme-toggle-track">
                    <div className="theme-toggle-thumb">
                        {theme === 'light' ? '☀️' : '🌙'}
                    </div>
                </div>
            </button>

            <button
                className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    );
}
