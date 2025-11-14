// import React, { useState } from 'react';
// import './NavigationBar.css';
// import logo from '../assets/logo.png';
// import { useTheme } from '../context/ThemeContext';

// export default function NavigationBar() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const { theme, toggleTheme } = useTheme();

//     const handleNavClick = (e, sectionId) => {
//         e.preventDefault();
//         setMenuOpen(false);

//         if (sectionId === 'home') {
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         } else {
//             const element = document.getElementById(sectionId);
//             if (element) {
//                 const navbar = document.querySelector('.hero-navbar');
//                 const navbarHeight = navbar ? navbar.offsetHeight : 80;
//                 const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
//                 window.scrollTo({ top: elementPosition, behavior: 'smooth' });
//             }
//         }
//     };

//     return (
//         <div className="hero-navbar">
//             <div className="logo-wrap">
//                 <img src={logo} alt="TypingPro Logo" />
//                 <span className="brand-text">TypingPro</span>
//             </div>

//             <nav className={menuOpen ? 'active' : ''}>
//                 <button onClick={(e) => handleNavClick(e, 'home')}>Home</button>
//                 <button onClick={(e) => handleNavClick(e, 'about')}>About</button>
//                 <button onClick={(e) => handleNavClick(e, 'testimonials')}>Testimonials</button>
//                 <button onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</button>
//                 <button onClick={(e) => handleNavClick(e, 'contact')}>Contact</button>
//             </nav>

//             <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
//                 <div className="theme-toggle-track">
//                     <div className="theme-toggle-thumb">
//                         {theme === 'light' ? '☀️' : '🌙'}
//                     </div>
//                 </div>
//             </button>

//             <button
//                 className={`menu-toggle ${menuOpen ? 'active' : ''}`}
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 aria-label="Toggle menu"
//             >
//                 <span></span>
//                 <span></span>
//                 <span></span>
//             </button>
//         </div>
//     );
// }

import { useState, useRef, useEffect } from 'react';
import './NavigationBar.css';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';

export default function NavigationBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navbarRef = useRef(null);
    const navRef = useRef(null);

    const handleNavClick = (sectionId) => {
        // Close mobile menu
        setMenuOpen(false);

        if (sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                // Use ref to get current navbar height, fallback to 80
                const navbar = navbarRef.current;
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            }
        }
    };

    // Close menu when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!menuOpen) return;
            if (navRef.current && !navRef.current.contains(e.target) && navbarRef.current && !navbarRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape' && menuOpen) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [menuOpen]);

    return (
        <header className="hero-navbar" ref={navbarRef}>
            <div className="logo-wrap">
                <img src={logo} alt="TypingPro Logo" />
                <span className="brand-text">TypingPro</span>
            </div>

            <nav
                id="hero-main-nav"
                ref={navRef}
                role="navigation"
                className={menuOpen ? 'active' : ''}
                aria-hidden={!menuOpen}
            >
                <button onClick={() => handleNavClick('home')}>Home</button>
                <button onClick={() => handleNavClick('about')}>About</button>
                <button onClick={() => handleNavClick('testimonials')}>Testimonials</button>
                <button onClick={() => handleNavClick('how-it-works')}>How It Works</button>
                <button onClick={() => handleNavClick('contact')}>Contact</button>
            </nav>

            <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                aria-pressed={theme !== 'light'}
            >
                <div className="theme-toggle-track">
                    <div className="theme-toggle-thumb">
                        {theme === 'light' ? '☀️' : '🌙'}
                    </div>
                </div>
            </button>

            <button
                className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="hero-main-nav"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
}

