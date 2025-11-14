import React from 'react';

export default function ContactSection() {
    return (
        <section className="contact-section" id="contact">
            <div className="contact-container">
                <h2>Get In Touch</h2>
                <p>Have questions about TypingPro? We'd love to hear from you!</p>
                <div className="contact-content">
                    <div className="contact-form">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <input type="text" placeholder="Your Name" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Your Email" required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Your Message" rows="5" required></textarea>
                            </div>
                            <button type="submit" className="contact-submit-btn">Send Message</button>
                        </form>
                    </div>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            <div>
                                <h4>Email</h4>
                                <p>hello@typingpro.com</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <div>
                                <h4>Location</h4>
                                <p>Main Street, India</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <div>
                                <h4>Phone</h4>
                                <p>+91 1234567890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
