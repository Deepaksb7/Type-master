import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import NavigationBar from './NavigationBar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import TestimonialsSection from './TestimonialsSection';
import HowItWorksSection from './HowItWorksSection';
import ContactSection from './ContactSection';
import FooterSection from './FooterSection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // GSAP ScrollTrigger animations
        const ctx = gsap.context(() => {
            gsap.from('.about-section-modern', {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about-section-modern',
                    start: 'top 80%',
                },
            });

            gsap.from('.testimonials-title', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.testimonials-section',
                    start: 'top 80%',
                },
            });

            gsap.from('.testimonials-subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.testimonials-section',
                    start: 'top 80%',
                },
            });

            gsap.from('.sub-about-section', {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.sub-about-section',
                    start: 'top 80%',
                },
            });
        });

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const handleGetStarted = () => {
        navigate('/user-auth');
    };

    const handleTryDemo = () => {
        sessionStorage.setItem('isDemoMode', 'true');
        sessionStorage.setItem('demoStartTime', Date.now().toString());
        navigate('/typing');
    };

    const testimonials = [
        {
            name: 'Aarohi Verma',
            role: 'Student, Delhi',
            image: 'https://randomuser.me/api/portraits/women/65.jpg',
            text: 'TypingPro completely changed how I practice! The progress tracking and community are amazing. I hit 85 WPM in 3 weeks!',
            rating: 5,
        },
        {
            name: 'Rohan Singh',
            role: 'Software Engineer',
            image: 'https://randomuser.me/api/portraits/men/91.jpg',
            text: 'The interactive lessons and real-time stats made learning fun. I use TypingPro daily during my work breaks.',
            rating: 5,
        },
        {
            name: 'Meera Patel',
            role: 'Freelancer',
            image: 'https://randomuser.me/api/portraits/women/42.jpg',
            text: "It's not just a typing site—it's a motivating community. Tracking improvement has made me so consistent!",
            rating: 5,
        },
        {
            name: 'Arjun Sharma',
            role: 'Content Writer',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            text: 'I improved from 40 to 70 WPM in just one month! The gamified lessons keep me engaged every day.',
            rating: 5,
        },
        {
            name: 'Priya Gupta',
            role: 'Teacher, Mumbai',
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            text: 'TypingPro helped me teach my students typing skills efficiently. The progress reports are incredibly helpful!',
            rating: 5,
        },
        {
            name: 'Karan Mehta',
            role: 'Data Analyst',
            image: 'https://randomuser.me/api/portraits/men/45.jpg',
            text: 'The accuracy tracking feature is fantastic. My typing errors dropped by 80% in just 2 weeks!',
            rating: 5,
        },
        {
            name: 'Ananya Rao',
            role: 'College Student',
            image: 'https://randomuser.me/api/portraits/women/29.jpg',
            text: 'I love the leaderboard feature! It motivates me to practice every single day. Highly recommend TypingPro!',
            rating: 5,
        },
        {
            name: 'Vikram Desai',
            role: 'Business Analyst',
            image: 'https://randomuser.me/api/portraits/men/78.jpg',
            text: "Best typing platform I've used! The UI is clean, and the analytics help me track my daily progress.",
            rating: 5,
        },
        {
            name: 'Sneha Kumar',
            role: 'Graphic Designer',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            text: "TypingPro is beautifully designed and super intuitive. I've improved my typing speed drastically!",
            rating: 5,
        },
        {
            name: 'Rajesh Iyer',
            role: 'Marketing Manager',
            image: 'https://randomuser.me/api/portraits/men/56.jpg',
            text: "The community support and real-time challenges make learning exciting. I've never been more motivated!",
            rating: 5,
        },
    ];

    return (
        <>
            <NavigationBar />
            <HeroSection handleGetStarted={handleGetStarted} handleTryDemo={handleTryDemo} />
            <AboutSection />
            <TestimonialsSection testimonials={testimonials} />
            <HowItWorksSection />
            <ContactSection />
            <FooterSection />
        </>
    );
}
