import React, { useEffect, useState } from "react";
import LockedLetters from "./LockedLetters";
import { useTheme } from '../context/ThemeContext';

const DEFAULT_UNLOCK_ORDER_STR = "e n i a r l t o s u d y c g h p m k b w f z v x q j";

export default function Settings(props) {
    const { theme } = useTheme();

    // Props (some may be optional depending on caller)
    const {
        targetWPM,
        setTargetWPM,
        unlockNewWords,
        setUnlockNewWords,
        lockedSet,
        setLockedSet,
        unlockMode,
        setUnlockMode,
        unlockOrder,
        setUnlockOrder,
        onClose
    } = props;

    const initialWPM = typeof targetWPM === "number" ? targetWPM : 40;
    const initialUnlockWords = typeof unlockNewWords === "boolean" ? unlockNewWords : false;
    const initialMode = typeof unlockMode === "string" ? unlockMode : "byWPM"; // byWPM | manual | byOrder
    const initialOrder = Array.isArray(unlockOrder) && unlockOrder.length
        ? unlockOrder.join(" ")
        : DEFAULT_UNLOCK_ORDER_STR;

    const [wpm, setWpm] = useState(initialWPM);
    const [unlockWordsLocal, setUnlockWordsLocal] = useState(initialUnlockWords);
    const [mode, setMode] = useState(initialMode);
    const [orderText, setOrderText] = useState(initialOrder);
    const [localLockedSet, setLocalLockedSet] = useState(() => (lockedSet ? new Set(Array.from(lockedSet)) : new Set()));
    const [showTooltip, setShowTooltip] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);

    useEffect(() => {
        if (lockedSet) setLocalLockedSet(new Set(Array.from(lockedSet)));
    }, [lockedSet]);

    const apply = () => {
        // apply numeric WPM
        if (typeof setTargetWPM === "function") setTargetWPM(Number(wpm) || 0);
        if (typeof setUnlockNewWords === "function") setUnlockNewWords(Boolean(unlockWordsLocal));
        if (typeof setLockedSet === "function") setLockedSet(new Set(Array.from(localLockedSet)));
        if (typeof setUnlockMode === "function") setUnlockMode(mode);

        // parse custom order: keep only letters a-z, lowercased, unique, keep rest in end (if missing)
        const parsed = orderText
            .toLowerCase()
            .split(/[^a-z]+/)
            .filter(Boolean);

        const seen = new Set();
        const cleaned = [];
        for (const ch of parsed) {
            if (!seen.has(ch) && ch.length === 1) {
                seen.add(ch);
                cleaned.push(ch);
            }
        }
        // append missing letters in alphabetical order
        for (const ch of "abcdefghijklmnopqrstuvwxyz") {
            if (!seen.has(ch)) cleaned.push(ch);
        }
        if (typeof setUnlockOrder === "function") setUnlockOrder(cleaned);

        if (typeof onClose === "function") onClose();
    };

    const toggleLetter = (ch) => {
        const copy = new Set(localLockedSet);
        ch = String(ch).toLowerCase();
        if (copy.has(ch)) copy.delete(ch);
        else copy.add(ch);
        setLocalLockedSet(copy);
    };

    const Tooltip = ({ id, content }) => (
        showTooltip === id && (
            <div className="settings-tooltip">
                {content}
            </div>
        )
    );

    return (
        <div className={`settings-container ${theme}`}>
            <div className="settings-header">
                <div className="settings-icon">⚙️</div>
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Customize your typing experience</p>
            </div>

            <div className="settings-grid">
                {/* Performance Settings */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="card-icon">🎯</div>
                        <h3 className="card-title">Performance Goals</h3>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                Target WPM
                                <span
                                    className="info-icon"
                                    onMouseEnter={() => setShowTooltip('wpm')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                >ℹ️</span>
                                <Tooltip id="wpm" content="Set your target words per minute. Reaching this unlocks new letters." />
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    min={1}
                                    max={400}
                                    value={wpm}
                                    onChange={(e) => setWpm(Number(e.target.value || 0))}
                                    className="setting-input"
                                />
                                <span className="input-unit">WPM</span>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-switch">
                                <input
                                    type="checkbox"
                                    checked={unlockWordsLocal}
                                    onChange={(e) => setUnlockWordsLocal(e.target.checked)}
                                />
                                <span className="switch-slider"></span>
                                <span className="switch-label">
                                    Auto-unlock words
                                    <span
                                        className="info-icon"
                                        onMouseEnter={() => setShowTooltip('words')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >ℹ️</span>
                                    <Tooltip id="words" content="Automatically unlock new words when you complete a text block." />
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Unlock Mode Settings */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="card-icon">🔓</div>
                        <h3 className="card-title">Letter Unlock Mode</h3>
                    </div>
                    <div className="card-content">
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="unlockMode"
                                    value="byWPM"
                                    checked={mode === "byWPM"}
                                    onChange={() => setMode("byWPM")}
                                />
                                <span className="radio-checkmark"></span>
                                <div className="radio-content">
                                    <div className="radio-title">Performance Based</div>
                                    <div className="radio-description">Unlock letters by reaching your target WPM</div>
                                </div>
                            </label>

                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="unlockMode"
                                    value="byOrder"
                                    checked={mode === "byOrder"}
                                    onChange={() => setMode("byOrder")}
                                />
                                <span className="radio-checkmark"></span>
                                <div className="radio-content">
                                    <div className="radio-title">Custom Order</div>
                                    <div className="radio-description">Follow a specific letter unlock sequence</div>
                                </div>
                            </label>

                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="unlockMode"
                                    value="manual"
                                    checked={mode === "manual"}
                                    onChange={() => setMode("manual")}
                                />
                                <span className="radio-checkmark"></span>
                                <div className="radio-content">
                                    <div className="radio-title">Manual Control</div>
                                    <div className="radio-description">Manually choose which letters to lock/unlock</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="card-icon">🔊</div>
                        <h3 className="card-title">Audio & Visual</h3>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-switch">
                                <input
                                    type="checkbox"
                                    checked={soundEnabled}
                                    onChange={(e) => setSoundEnabled(e.target.checked)}
                                />
                                <span className="switch-slider"></span>
                                <span className="switch-label">
                                    Sound Effects
                                    <span
                                        className="info-icon"
                                        onMouseEnter={() => setShowTooltip('sound')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >ℹ️</span>
                                    <Tooltip id="sound" content="Enable sound effects for typing feedback." />
                                </span>
                            </label>
                        </div>

                        <div className="setting-group">
                            <label className="setting-switch">
                                <input
                                    type="checkbox"
                                    checked={animationsEnabled}
                                    onChange={(e) => setAnimationsEnabled(e.target.checked)}
                                />
                                <span className="switch-slider"></span>
                                <span className="switch-label">
                                    Animations
                                    <span
                                        className="info-icon"
                                        onMouseEnter={() => setShowTooltip('animations')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >ℹ️</span>
                                    <Tooltip id="animations" content="Enable visual animations and transitions." />
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Custom Order Settings */}
                {mode === "byOrder" && (
                    <div className="settings-card full-width">
                        <div className="card-header">
                            <div className="card-icon">📝</div>
                            <h3 className="card-title">Custom Unlock Order</h3>
                        </div>
                        <div className="card-content">
                            <div className="setting-group">
                                <label className="setting-label">
                                    Letter Sequence
                                    <span
                                        className="info-icon"
                                        onMouseEnter={() => setShowTooltip('order')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >ℹ️</span>
                                    <Tooltip id="order" content="Enter letters in the order you want them unlocked. Separate with spaces or commas." />
                                </label>
                                <textarea
                                    value={orderText}
                                    onChange={(e) => setOrderText(e.target.value)}
                                    className="setting-textarea"
                                    placeholder={DEFAULT_UNLOCK_ORDER_STR}
                                    rows={3}
                                />
                                <div className="setting-help">
                                    Letters you include first will be unlocked earlier. Any missing letters will be appended automatically.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Letter Control */}
                {mode === "manual" && (
                    <div className="settings-card full-width">
                        <div className="card-header">
                            <div className="card-icon">🎛️</div>
                            <h3 className="card-title">Manual Letter Control</h3>
                        </div>
                        <div className="card-content">
                            <div className="setting-group">
                                <label className="setting-label">Toggle Locked Letters</label>
                                <div className="locked-letters-container">
                                    <LockedLetters lockedSet={localLockedSet} onToggle={toggleLetter} />
                                </div>
                                <div className="setting-help">
                                    Click letters to toggle between locked (red) and unlocked (green) states.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="settings-actions">
                <button className="btn-primary" onClick={apply}>
                    <span className="btn-icon">💾</span>
                    Apply Settings
                </button>
                <button className="btn-secondary" onClick={() => typeof onClose === "function" && onClose()}>
                    <span className="btn-icon">❌</span>
                    Cancel
                </button>
            </div>
        </div>
    );
}
