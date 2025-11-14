import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ handleGetStarted, handleTryDemo }) {
    // Framer Motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const badgeVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15,
            },
        },
    };

    return (
        <section className="hero-modern" id="home">
            {/* Animated floating shapes */}
            <motion.div
                className="hero-shape hero-shape-1"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="hero-shape hero-shape-2"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="badges"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.span className="badge" variants={badgeVariants}>
                    🎯 Smart Practice
                </motion.span>
                <motion.span className="badge" variants={badgeVariants}>
                    🏆 Live Leaderboard
                </motion.span>
            </motion.div>

            <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 80,
                    damping: 15,
                    delay: 0.3,
                }}
            >
                AI Typing Practice for <br />
                Future-Ready Skills
            </motion.h1>

            <motion.div
                className="subtitle"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 80,
                    damping: 15,
                    delay: 0.5,
                }}
            >
                Boost your speed and accuracy with <b>animated lessons</b>, games,
                and detailed progress tracking.
            </motion.div>

            <motion.div
                className="hero-btns"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.button
                    className="main-btn"
                    onClick={handleGetStarted}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get Started Free
                </motion.button>
                <motion.button
                    className="ghost-btn"
                    onClick={handleTryDemo}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Try a Demo
                </motion.button>
            </motion.div>
        </section>
    );
}
