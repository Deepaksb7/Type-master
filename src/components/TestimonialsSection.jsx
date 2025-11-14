import React from 'react';

export default function TestimonialsSection({ testimonials }) {
    return (
        <section className="testimonials-section" id="testimonials">
            <h2 className="testimonials-title">What Our Users Say</h2>
            <p className="testimonials-subtitle">
                Thousands of learners and professionals are improving their typing
                every day with TypingPro.
            </p>
            <div className="testimonials-scroll-wrapper">
                <div className="testimonials-track">
                    {testimonials.map((testimonial, index) => (
                        <div className="testimonial-card" key={`first-${index}`}>
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="testimonial-avatar"
                            />
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <h4 className="testimonial-name">{testimonial.name}</h4>
                            <span className="testimonial-role">{testimonial.role}</span>
                            <div className="testimonial-rating">
                                {'⭐'.repeat(testimonial.rating)}
                            </div>
                        </div>
                    ))}
                    {testimonials.map((testimonial, index) => (
                        <div className="testimonial-card" key={`second-${index}`}>
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="testimonial-avatar"
                            />
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <h4 className="testimonial-name">{testimonial.name}</h4>
                            <span className="testimonial-role">{testimonial.role}</span>
                            <div className="testimonial-rating">
                                {'⭐'.repeat(testimonial.rating)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
