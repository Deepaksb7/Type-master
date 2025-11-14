import React from "react";
import "./Keyboard.css";

export default function Keyboard({ expectedKey, lastKey, lockedSet }) {
    const rows = [
        ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
        ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
        ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
        ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
        ["Space"]
    ];

    const fingerMap = {
        q: "left-pinkie", a: "left-pinkie", z: "left-pinkie",
        w: "left-ring", s: "left-ring", x: "left-ring",
        e: "left-middle", d: "left-middle", c: "left-middle",
        r: "left-index", f: "left-index", v: "left-index",
        t: "left-index", g: "left-index", b: "left-index",
        y: "right-index", h: "right-index", n: "right-index",
        u: "right-index", j: "right-index", m: "right-index",
        i: "right-middle", k: "right-middle",
        o: "right-ring", l: "right-ring",
        p: "right-pinkie"
    };

    const getFinger = (key) => {
        if (!key || typeof key !== "string") return "thumbs";
        return fingerMap[key.toLowerCase()] || "thumbs";
    };

    const isLocked = (key) => {
        if (!lockedSet || !key) return false;
        return lockedSet.has(key.toLowerCase());
    };

    return (
        <div className="keyboard-wrapper">
            {/* Finger Indicator */}
            <div className="finger-indicator">
                <span className="finger-label">Next Key:</span>
                <span className="finger-badge">
                    {expectedKey ? expectedKey.toUpperCase() : '?'}
                </span>
            </div>

            {/* Keyboard */}
            <div className="keyboard">
                {rows.map((row, rIdx) => (
                    <div key={rIdx} className="keyboard-row">
                        {row.map((key) => {
                            const finger = getFinger(key);
                            const isExpected = expectedKey && key.toLowerCase() === expectedKey.toLowerCase();
                            const isLastPressed = lastKey && key.toLowerCase() === lastKey.toLowerCase();
                            const locked = isLocked(key);

                            return (
                                <div
                                    key={key}
                                    className={`key ${finger} ${isExpected ? "target" : ""} ${isLastPressed ? "active" : ""} ${locked ? "locked-key" : ""}`}
                                >
                                    {key}
                                    {locked && <span className="lock-badge">🔒</span>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Keyboard Legend */}
            <div className="keyboard-legend">
                <div className="legend-item">
                    <div className="legend-color" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}></div>
                    <span className="legend-text">Next Key</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}></div>
                    <span className="legend-text">Last Pressed</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)' }}></div>
                    <span className="legend-text">Locked</span>
                </div>
            </div>
        </div>
    );
}
