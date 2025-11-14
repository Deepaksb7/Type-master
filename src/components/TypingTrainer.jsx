
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Keyboard from './Keyboard';
import Settings from './Settings';
import Profile from './Profile';
import Progress from './Progress';
import {
  getUserProgressSession,
  getUserProgress,
  updateUnlockedLettersSession,
  updateWPMSession,
  isSessionUser,
  saveLastSessionWPM,
  updateHighestWPM,
  saveUserProgress,
  saveSessionHistorySession,
  saveSessionHistory
} from '../utils/userProgressManager';
import { useTheme } from '../context/ThemeContext';
import './TypingTrainer.css';

// Default unlock order
const DEFAULT_UNLOCK_ORDER = ['e', 'n', 'i', 'a', 'r', 'l', 't', 'o', 's', 'u', 'd', 'y', 'c', 'g', 'h', 'p', 'm', 'k', 'b', 'w', 'f', 'z', 'v', 'x', 'q', 'j'];
const INITIALLY_UNLOCKED = 4;

export default function TypingTrainer() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // VIEW STATE
  const [currentView, setCurrentView] = useState('typing-test'); // 'typing-test', 'settings', 'profile', 'progress'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // DEMO MODE STATE
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoTimeLeft, setDemoTimeLeft] = useState(120);

  // SETTINGS STATE
  const [targetWPM, setTargetWPM] = useState(0);
  const [unlockNewWords, setUnlockNewWords] = useState(false);
  const [unlockMode, setUnlockMode] = useState('byWPM'); // 'byWPM', 'byOrder', 'manual'
  const [unlockOrder, setUnlockOrder] = useState(DEFAULT_UNLOCK_ORDER);
  const [lockedSet, setLockedSet] = useState(new Set(unlockOrder.slice(INITIALLY_UNLOCKED)));

  // CONGRATULATIONS MODAL
  const [showCongrats, setShowCongrats] = useState(false);
  const [unlockedLetter, setUnlockedLetter] = useState(null);

  // TYPING TEST STATE
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [lastKey, setLastKey] = useState('');
  const [expectedKey, setExpectedKey] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);

  const [unlockedKeys, setUnlockedKeys] = useState(new Set(unlockOrder.slice(0, INITIALLY_UNLOCKED)));
  const [username, setUsername] = useState('');
  const [lastSessionWPM, setLastSessionWPM] = useState(0);

  // Helper: safely convert keys (Set or Array) to array
  const keysToArray = (keys) => {
    if (!keys) return [];
    return Array.isArray(keys) ? keys : Array.from(keys);
  };
  
// USER INITIALIZATION AND PROGRESS LOADING
useEffect(() => {
  const user = sessionStorage.getItem('username');
  const demoMode = sessionStorage.getItem('isDemoMode') === 'true';

  // If not logged in AND not in demo mode, force auth
  if (!user && !demoMode) {
    navigate('/user-auth');
    return;
  }

  // If demo mode, mark local state so demo timer/flow works
  if (demoMode) {
    setIsDemoMode(true);
    const startTime = sessionStorage.getItem('demoStartTime');
    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
      const remaining = Math.max(120 - elapsed, 0);
      setDemoTimeLeft(remaining);
    }
  }

  // If we have a username, load their progress (session or local)
  if (user) {
    setUsername(user);
    try {
      let progress = null;

      if (isSessionUser(user)) {
        progress = getUserProgressSession(user) || {};
      } else {
        // load persistent progress if available
        progress = getUserProgress(user) || {};
      }

      const unlockedArray = Array.isArray(progress.unlockedLetters)
        ? progress.unlockedLetters
        : unlockOrder.slice(0, INITIALLY_UNLOCKED);

      const userUnlockedKeys = new Set(unlockedArray);
      setUnlockedKeys(userUnlockedKeys);

      const lastWpm = progress.lastSessionWPM ?? 0;
      setLastSessionWPM(lastWpm);

      // Update locked set based on unlocked keys and current unlockOrder
      const allLetters = new Set(unlockOrder);
      const locked = new Set();
      allLetters.forEach(letter => {
        if (!userUnlockedKeys.has(letter)) locked.add(letter);
      });
      setLockedSet(locked);
    } catch (err) {
      console.warn('Failed to load user progress, using defaults:', err);
    }
  } else {
    // No username but in demo mode: keep defaults (initial 4 unlocked)
    // Optional: setUsername('demo') if you prefer a demo username.
  }
}, [navigate]);



  // DEMO MODE INITIALIZATION
  useEffect(() => {
    const demoMode = sessionStorage.getItem('isDemoMode');
    if (demoMode === 'true') {
      setIsDemoMode(true);
      const startTime = sessionStorage.getItem('demoStartTime');
      if (startTime) {
        const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
        const remaining = Math.max(120 - elapsed, 0);
        setDemoTimeLeft(remaining);
      }
    }
  }, []);

  // DEMO TIMER
  useEffect(() => {
    if (isDemoMode && demoTimeLeft > 0) {
      const timer = setInterval(() => {
        setDemoTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            sessionStorage.removeItem('isDemoMode');
            sessionStorage.removeItem('demoStartTime');
            navigate('/user-auth');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isDemoMode, demoTimeLeft, navigate]);

  // GENERATED TEXT FROM UNLOCKED LETTERS
  const generateTextFromKeys = (keys) => {
    const arr = keysToArray(keys);
    if (!arr || arr.length === 0) return 'Please unlock some keys in settings.';

    const words = [];
    for (let i = 0; i < 25; i++) {
      const len = Math.floor(Math.random() * 4) + 3;
      let word = '';
      for (let j = 0; j < len; j++) {
        word += arr[Math.floor(Math.random() * arr.length)];
      }
      words.push(word);
    }
    return words.join(' ');
  };

  useEffect(() => {
    const newText = generateTextFromKeys(Array.from(unlockedKeys));
    setText(newText);
    setUserInput('');
    setCurrentIndex(0);
    setExpectedKey(newText[0] || '');
    // Reset metrics when unlockedKeys change
    setIsTestActive(false);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setCurrentSpeed(0);
    setScore(0);
    setStartTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedKeys]);

  // eslint-disable-next-line no-unused-vars
  const resetTest = () => {
    const newText = generateTextFromKeys(Array.from(unlockedKeys));
    setText(newText);
    setUserInput('');
    setCurrentIndex(0);
    setIsTestActive(false);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setCurrentSpeed(0);
    setScore(0);
    setLastKey('');
    setExpectedKey(newText[0] || '');
    setStartTime(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const calculateMetrics = (correct, total, elapsedSeconds) => {
    const safeElapsed = Math.max(elapsedSeconds, 0.001); // avoid division by zero
    const words = correct / 5;
    const minutes = Math.max(safeElapsed / 60, 0.001);
    const calculatedWpm = Math.round(words / minutes);
    const calculatedAccuracy = total > 0 ? (correct / total) * 100 : 100;
    setAccuracy(Number(calculatedAccuracy.toFixed(2)));
    setCurrentSpeed(Number(calculatedWpm)); // keep as number
    setScore(Math.round(calculatedWpm * (calculatedAccuracy / 100)));
  };

  const handleKeyPress = useCallback((e) => {
    if (currentView !== 'typing-test') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) return;
    e.preventDefault();

    const now = Date.now();

    // Ensure we have a valid start time for metrics calculations. If starting now, use now.
    let startedAt = startTime;
    if (!startedAt) {
      startedAt = now;
      setStartTime(startedAt);
    }

    if (!isTestActive && e.key.length === 1) {
      setIsTestActive(true);
      // startTime already handled above
    }

    const key = e.key.toLowerCase();
    setLastKey(key);
    const expectedChar = text[currentIndex] || '';

    // Local copies of counters to avoid stale state issues
    let localCorrect = correctChars;
    let localTotal = totalChars;
    let localIndex = currentIndex;
    let localUserInput = userInput;

    if (key === expectedChar && key.length === 1) {
      // Correct character
      localCorrect = localCorrect + 1;
      localTotal = localTotal + 1;
      localIndex = localIndex + 1;
      localUserInput = localUserInput + key;

      // Update states using the local values
      setCorrectChars(localCorrect);
      setTotalChars(localTotal);
      setCurrentIndex(localIndex);
      setExpectedKey(text[localIndex] || '');
      setUserInput(localUserInput);

      // Calculate metrics using startedAt (guaranteed to be set)
      const elapsed = Math.max((now - startedAt) / 1000, 0.001);
      calculateMetrics(localCorrect, localTotal, elapsed);

      if (localIndex >= text.length) {
        // Completed text block
        const finalElapsed = Math.max((now - startedAt) / 1000, 0.001);
        const finalWords = localCorrect / 5;
        const finalMinutes = Math.max(finalElapsed / 60, 0.001);
        const finalWpm = Math.round(finalWords / finalMinutes);
        const finalAccuracy = localTotal > 0 ? Math.round((localCorrect / localTotal) * 100) : 100;

        // Persist WPM + history
        try {
          if (username) {
            // Save session (sessionStorage) if applicable
            if (isSessionUser(username)) {
              updateWPMSession(username, finalWpm);
              // Also save last session and highest to localStorage for persistence
              saveLastSessionWPM(username, finalWpm);
              updateHighestWPM(username, finalWpm);

              // Save session history (both session and local)
              const sessionData = {
                date: new Date().toISOString(),
                wpm: finalWpm,
                accuracy: finalAccuracy,
                lettersUnlocked: Array.from(unlockedKeys).length,
                duration: Math.round(finalElapsed)
              };
              saveSessionHistorySession(username, sessionData);
              saveSessionHistory(username, sessionData);

              // Update local state for last session shown in UI
              setLastSessionWPM(finalWpm);
            } else {
              // Non-session user: try to persist to local storage
              saveLastSessionWPM(username, finalWpm);
              updateHighestWPM(username, finalWpm);
              const sessionData = {
                date: new Date().toISOString(),
                wpm: finalWpm,
                accuracy: finalAccuracy,
                lettersUnlocked: Array.from(unlockedKeys).length,
                duration: Math.round(finalElapsed)
              };
              saveSessionHistory(username, sessionData);
              setLastSessionWPM(finalWpm);
            }
          }
        } catch (err) {
          console.warn('Failed persisting session data:', err);
        }

        // Check for letter unlock after completing the text
        try {
          if (unlockMode === 'byWPM' && finalWpm >= targetWPM && lockedSet.size > 0) {
            const nextLetter = unlockOrder.find(ch => lockedSet.has(ch));
            if (nextLetter) {
              const newLocked = new Set(lockedSet);
              newLocked.delete(nextLetter);
              setLockedSet(newLocked);

              const newUnlocked = new Set(unlockedKeys);
              newUnlocked.add(nextLetter);
              setUnlockedKeys(newUnlocked);

              // Save progress to sessionStorage and localStorage as appropriate
              if (username) {
                if (isSessionUser(username)) {
                  updateUnlockedLettersSession(username, Array.from(newUnlocked));
                  saveUserProgress(username, Array.from(newUnlocked), finalWpm);
                } else {
                  // Persist in localStorage-only case
                  saveUserProgress(username, Array.from(newUnlocked), finalWpm);
                }
              }

              setUnlockedLetter(nextLetter.toUpperCase());
              setShowCongrats(true);
              setTimeout(() => setShowCongrats(false), 3000);
            }
          }
        } catch (err) {
          console.warn('Unlock flow failed:', err);
        }

        // Prepare next block — reset indices & metrics but keep unlocked keys & continue test (start new block)
        const newWords = generateTextFromKeys(Array.from(unlockedKeys));
        setText(newWords);
        setCurrentIndex(0);
        setExpectedKey(newWords[0] || '');
        setUserInput('');
        setCorrectChars(0);
        setTotalChars(0);
        setCurrentSpeed(0);
        setAccuracy(100);
        setScore(0);
        // Reset startTime so next keypress restarts timer cleanly
        setStartTime(null);
        setIsTestActive(false);
      }

    } else if (key.length === 1) {
      // Incorrect character (visible to user)
      localTotal = localTotal + 1;
      setTotalChars(localTotal);

      const elapsed = Math.max((now - startedAt) / 1000, 0.001);
      calculateMetrics(localCorrect, localTotal, elapsed);
    }

  }, [
    currentView,
    isTestActive,
    text,
    currentIndex,
    correctChars,
    totalChars,
    startTime,
    unlockMode,
    targetWPM,
    lockedSet,
    unlockOrder,
    unlockedKeys,
    username
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="typing-test-container">
      {/* UNIQUE Animated Background */}
      <div className="animated-background">
        <div className="morph-blob blob-1"></div>
        <div className="morph-blob blob-2"></div>
        <div className="morph-blob blob-3"></div>

        <div className="geometric-pattern">
          <div className="geo-shape geo-circle"></div>
          <div className="geo-shape geo-triangle"></div>
          <div className="geo-shape geo-square"></div>
          <div className="geo-shape geo-hexagon"></div>
        </div>

        <svg className="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path className="wave-path" fill="url(#gradient)" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
           M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
           M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className="gradient-stop-1" />
              <stop offset="100%" className="gradient-stop-2" />
            </linearGradient>
          </defs>
        </svg>

        <div className="particle-system">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle-trail particle-${i + 1}`}>
              <span className="particle-dot"></span>
            </div>
          ))}
        </div>

        <div className="grid-overlay"></div>
      </div>

      {/* Sidebar */}
      <nav className={`sidebar-nav ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="nav-header">
          {!isSidebarCollapsed && <h2 className="nav-logo">TypeMaster</h2>}
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <ul className="nav-menu">
          <li className="nav-item"><button className="nav-link" onClick={(e) => { e.stopPropagation(); navigate('/'); }}>🏠 {!isSidebarCollapsed && 'Home'}</button></li>
          <li className={`nav-item ${currentView === 'typing-test' ? 'active' : ''}`}><button className="nav-link" onClick={(e) => { console.log('Setting view to typing-test'); e.stopPropagation(); setCurrentView('typing-test'); }}>⌨️ {!isSidebarCollapsed && 'Typing Test'}</button></li>
          <li className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}><button className="nav-link" onClick={(e) => { console.log('Setting view to settings'); e.stopPropagation(); setCurrentView('settings'); }}>⚙️ {!isSidebarCollapsed && 'Settings'}</button></li>
          <li className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}><button className="nav-link" onClick={(e) => { console.log('Setting view to profile'); e.stopPropagation(); setCurrentView('profile'); }}>👤 {!isSidebarCollapsed && 'Profile'}</button></li>
          <li className={`nav-item ${currentView === 'progress' ? 'active' : ''}`}><button className="nav-link" onClick={(e) => { console.log('Setting view to progress'); e.stopPropagation(); setCurrentView('progress'); }}>📊 {!isSidebarCollapsed && 'Progress'}</button></li>
          <li className="nav-item">
            <button className="nav-link theme-toggle" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
              {theme === 'light' ? '🌙' : '☀️'} {!isSidebarCollapsed && (theme === 'light' ? 'Dark' : 'Light')}
            </button>
          </li>
          <li className="nav-item"><button className="nav-link" onClick={(e) => { e.stopPropagation(); sessionStorage.clear(); navigate('/user-auth'); }}>🚪 {!isSidebarCollapsed && 'Logout'}</button></li>
        </ul>
      </nav>

      {/* MAIN AREA */}
      <main className="typing-test-main">
        {/* ACTION ICONS (TOP RIGHT) */}
        <div className="action-icons">
          <button className="icon-btn" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {currentView === 'settings' ? (
          /* SETTINGS VIEW */
          <div className="settings-view">
            <Settings
              targetWPM={targetWPM}
              setTargetWPM={setTargetWPM}
              unlockNewWords={unlockNewWords}
              setUnlockNewWords={setUnlockNewWords}
              lockedSet={lockedSet}
              setLockedSet={setLockedSet}
              unlockMode={unlockMode}
              setUnlockMode={setUnlockMode}
              unlockOrder={unlockOrder}
              setUnlockOrder={setUnlockOrder}
              onClose={() => setCurrentView('typing-test')}
            />
          </div>
        ) : currentView === 'profile' ? (
          /* PROFILE VIEW */
          <div className="settings-view">
            <Profile onClose={() => setCurrentView('typing-test')} />
          </div>
        ) : currentView === 'progress' ? (
          /* PROGRESS VIEW */
          <div className="settings-view">
            <Progress onClose={() => setCurrentView('typing-test')} />
          </div>
        ) : (
          /* TYPING TEST VIEW */
          <>
            {/* --- CONGRATS MODAL --- */}
            {showCongrats && (
              <div className="congrats-modal-overlay">
                <div className="congrats-modal-content">
                  🎉 Congratulations! The letter <span className="congrats-letter">{unlockedLetter}</span> is now unlocked!
                </div>
              </div>
            )}

            {/* DEMO TIMER DISPLAY */}
            {isDemoMode && (
              <div className="demo-timer-header">
                <div className="demo-timer-display">
                  Demo Time Remaining: <strong>{Math.floor(demoTimeLeft / 60)}:{(demoTimeLeft % 60).toString().padStart(2, '0')}</strong>
                </div>
              </div>
            )}

            {/* METRICS HEADER */}
            <div className="metrics-header">
              <div className="metrics-row">
                <div className="metric-group">
                  <span className="metric-label">Speed:</span>
                  <span className="metric-value">{currentSpeed.toFixed(1)}wpm</span>
                </div>
                <div className="metric-group">
                  <span className="metric-label">Accuracy:</span>
                  <span className="metric-value">{accuracy.toFixed(2)}%</span>
                </div>
                <div className="metric-group">
                  <span className="metric-label">Score:</span>
                  <span className="metric-value">{score}</span>
                </div>
                <div className="metric-group">
                  <span className="metric-label">Last Session:</span>
                  <span className="metric-value">{lastSessionWPM}wpm</span>
                </div>
              </div>

              <div className="key-status-bar">
                <span>Unlocked Keys:</span>
                <div className="keys-display">
                  {unlockOrder.map(k => (
                    <span key={k} className={`key-badge ${unlockedKeys.has(k) ? 'unlocked' : 'locked'}`}>
                      {k.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* TEXT AREA */}
            <div className="text-display-area">
              <div className="text-content">
                {text.split('').map((char, i) => {
                  let cls = 'char';
                  if (i < currentIndex) cls += (userInput[i] === char) ? ' typed-correct' : ' typed-incorrect';
                  else if (i === currentIndex) cls += ' current';
                  return <span key={i} className={cls}>{char}</span>;
                })}
              </div>
            </div>

            {/* KEYBOARD */}
            <div className="keyboard-container">
              <Keyboard lastKey={lastKey} expectedKey={expectedKey} lockedSet={lockedSet} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

