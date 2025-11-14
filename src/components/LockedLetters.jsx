import React from "react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function LockedLetters({ lockedSet = new Set(), onToggle = () => { }, order = null }) {
    // if caller provided an order (array of letters), use it; otherwise default alphabetical
    const list = Array.isArray(order) && order.length ? order : ALPHABET;
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {list.map((c) => {
                const locked = typeof lockedSet.has === "function" ? lockedSet.has(c) : false;
                return (
                    <button
                        key={c}
                        onClick={() => onToggle(c)}
                        className={locked ? "letter-btn locked" : "letter-btn unlocked"}
                        title={locked ? "Locked" : "Unlocked"}
                        aria-pressed={locked}
                        style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "none",
                            cursor: "pointer",
                            background: locked ? "rgba(239,68,68,0.12)" : "rgba(125,211,252,0.06)",
                            color: locked ? "var(--incorrect)" : "var(--accent)",
                            minWidth: 28,
                            textTransform: "uppercase",
                            fontWeight: 600,
                        }}
                    >
                        {c}
                    </button>
                );
            })}
        </div>
    );
}