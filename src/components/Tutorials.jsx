import React, { useState } from "react";
import "./Tutorials.css";

const STEPS = [
    { title: "Welcome!", desc: "This app will help you learn touch typing with smart, adaptive lessons." },
    { title: "Home Row", desc: "Start with your fingers on the home row keys (ASDF JKL;)." },
    { title: "Accuracy First", desc: "Slow is ok. Accuracy is more important than speed in the beginning." },
    { title: "Special Characters", desc: "You'll practice shift, numbers, and symbols—with visual cues and tips!" },
    { title: "You're Ready!", desc: "Practice regularly and use the live stats panel to track your growth." }
];

export default function Tutorials({ onComplete }) {
    const [idx, setIdx] = useState(0);
    const next = () => idx < STEPS.length - 1 ? setIdx(idx + 1) : onComplete();
    return (
        <div className="tutorials-bg">
            <div className="tutorial-card">
                <h2>{STEPS[idx].title}</h2>
                <p>{STEPS[idx].desc}</p>
                <button onClick={next}>{idx < STEPS.length - 1 ? "Next" : "Finish & Start"}</button>
            </div>
        </div>
    );
}
