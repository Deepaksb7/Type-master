// // Save user progress to sessionStorage (for new users)
// export function saveUserProgressSession(
//   username,
//   unlockedLetters,
//   highestWPM = 0,
//   lastSessionWPM = 0
// ) {
//   const progress = {
//     unlockedLetters: unlockedLetters,
//     highestWPM: highestWPM,
//     lastSessionWPM: lastSessionWPM,
//     createdAt: new Date().toISOString(),
//     lastUpdated: new Date().toISOString(),
//   };

//   sessionStorage.setItem(`userProgress_${username}`, JSON.stringify(progress));
// }

// // Get user progress from sessionStorage
// export function getUserProgressSession(username) {
//   const progressData = sessionStorage.getItem(`userProgress_${username}`);
//   if (progressData) {
//     return JSON.parse(progressData);
//   }

//   // Return default progress for new users
//   return {
//     unlockedLetters: ["e", "n", "i", "a"], // Initially unlocked 4 letters
//     highestWPM: 0,
//     lastSessionWPM: 0,
//     createdAt: new Date().toISOString(),
//     lastUpdated: new Date().toISOString(),
//   };
// }

// // Update unlocked letters in session
// export function updateUnlockedLettersSession(username, unlockedLetters) {
//   const progress = getUserProgressSession(username);
//   progress.unlockedLetters = unlockedLetters;
//   progress.lastUpdated = new Date().toISOString();
//   sessionStorage.setItem(`userProgress_${username}`, JSON.stringify(progress));
// }

// // Update WPM in session
// export function updateWPMSession(username, wpm) {
//   const progress = getUserProgressSession(username);
//   progress.lastSessionWPM = wpm;
//   if (wpm > progress.highestWPM) {
//     progress.highestWPM = wpm;
//   }
//   progress.lastUpdated = new Date().toISOString();
//   sessionStorage.setItem(`userProgress_${username}`, JSON.stringify(progress));
// }

// // Check if user uses session storage (new user)
// export function isSessionUser(username) {
//   return sessionStorage.getItem(`userProgress_${username}`) !== null;
// }

// // Save user progress to localStorage (for existing users)
// export function saveUserProgress(username, unlockedLetters, highestWPM = 0) {
//   const users = JSON.parse(localStorage.getItem("users") || "{}");

//   if (!users[username]) {
//     users[username] = {
//       unlockedLetters: [],
//       highestWPM: 0,
//       lastSessionWPM: 0,
//       createdAt: new Date().toISOString(),
//     };
//   }

//   users[username].unlockedLetters = unlockedLetters;

//   // Update highest WPM only if new WPM is higher
//   if (highestWPM > (users[username].highestWPM || 0)) {
//     users[username].highestWPM = highestWPM;
//   }

//   users[username].lastUpdated = new Date().toISOString();

//   localStorage.setItem("users", JSON.stringify(users));
// }

// // Get user progress from localStorage
// export function getUserProgress(username) {
//   const users = JSON.parse(localStorage.getItem("users") || "{}");
//   return (
//     users[username] || {
//       unlockedLetters: [],
//       highestWPM: 0,
//       lastSessionWPM: 0,
//       createdAt: null,
//       lastUpdated: null,
//     }
//   );
// }

// // Save last completed session WPM to localStorage
// export function saveLastSessionWPM(username, wpm) {
//   const users = JSON.parse(localStorage.getItem("users") || "{}");

//   if (users[username]) {
//     users[username].lastSessionWPM = wpm;
//     users[username].lastUpdated = new Date().toISOString();
//     localStorage.setItem("users", JSON.stringify(users));
//   }
// }

// // Get last session WPM from localStorage
// export function getLastSessionWPM(username) {
//   const progress = getUserProgress(username);
//   return progress.lastSessionWPM || 0;
// }

// // Update highest WPM for user
// export function updateHighestWPM(username, wpm) {
//   const progress = getUserProgress(username);
//   if (wpm > (progress.highestWPM || 0)) {
//     saveUserProgress(username, progress.unlockedLetters, wpm);
//     return true; // New record!
//   }
//   return false;
// }

// // Save session history to sessionStorage (for new users)
// export function saveSessionHistorySession(username, sessionData) {
//   const sessions = getSessionHistorySession(username);
//   sessions.push(sessionData);
//   // Keep only last 50 sessions to prevent storage bloat
//   if (sessions.length > 50) {
//     sessions.shift();
//   }
//   sessionStorage.setItem(
//     `sessionHistory_${username}`,
//     JSON.stringify(sessions)
//   );
// }

// // Get session history from sessionStorage
// export function getSessionHistorySession(username) {
//   const historyData = sessionStorage.getItem(`sessionHistory_${username}`);
//   if (historyData) {
//     return JSON.parse(historyData);
//   }
//   return [];
// }

// // Save session history to localStorage (for existing users)
// export function saveSessionHistory(username, sessionData) {
//   const users = JSON.parse(localStorage.getItem("users") || "{}");
//   if (!users[username]) {
//     users[username] = {
//       unlockedLetters: [],
//       highestWPM: 0,
//       lastSessionWPM: 0,
//       sessionHistory: [],
//       createdAt: new Date().toISOString(),
//     };
//   }

//   if (!users[username].sessionHistory) {
//     users[username].sessionHistory = [];
//   }

//   users[username].sessionHistory.push(sessionData);
//   // Keep only last 50 sessions
//   if (users[username].sessionHistory.length > 50) {
//     users[username].sessionHistory.shift();
//   }

//   users[username].lastUpdated = new Date().toISOString();
//   localStorage.setItem("users", JSON.stringify(users));
// }

// // Get session history from localStorage
// export function getSessionHistory(username) {
//   const users = JSON.parse(localStorage.getItem("users") || "{}");
//   return users[username]?.sessionHistory || [];
// }

// Keep the same exported function names — internal logic fixed
const MAX_SESSIONS = 50;

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.warn("safeParse: failed to parse JSON:", e);
    return null;
  }
}

function nowISO() {
  return new Date().toISOString();
}

function readUsers() {
  const raw = localStorage.getItem("users");
  const parsed = safeParse(raw);
  return parsed && typeof parsed === "object" ? parsed : {};
}

function writeUsers(users) {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (e) {
    console.error("writeUsers: failed to write to localStorage:", e);
  }
}

/* ---------------- Session storage helpers ---------------- */

function readSessionKey(username) {
  if (!username) return null;
  const raw = sessionStorage.getItem(`userProgress_${username}`);
  return safeParse(raw);
}

function writeSessionKey(username, progress) {
  if (!username) return false;
  try {
    sessionStorage.setItem(`userProgress_${username}`, JSON.stringify(progress));
    return true;
  } catch (e) {
    console.error("writeSessionKey: failed to write to sessionStorage:", e);
    return false;
  }
}

/* ---------------- Exported functions (names unchanged) ---------------- */

// Save user progress to sessionStorage (for new users)
export function saveUserProgressSession(
  username,
  unlockedLetters,
  highestWPM = 0,
  lastSessionWPM = 0
) {
  if (!username) return false;

  const safeUnlocked = Array.isArray(unlockedLetters) ? unlockedLetters : [];
  const safeHighest = Number.isFinite(highestWPM) ? highestWPM : 0;
  const safeLast = Number.isFinite(lastSessionWPM) ? lastSessionWPM : 0;

  const progress = {
    unlockedLetters: safeUnlocked,
    highestWPM: safeHighest,
    lastSessionWPM: safeLast,
    createdAt: nowISO(),
    lastUpdated: nowISO(),
  };

  return writeSessionKey(username, progress);
}

// Get user progress from sessionStorage
export function getUserProgressSession(username) {
  if (!username) return null;
  const progressData = readSessionKey(username);
  if (progressData && typeof progressData === "object") {
    // Ensure fields exist and types are sane
    return {
      unlockedLetters: Array.isArray(progressData.unlockedLetters)
        ? progressData.unlockedLetters
        : ["e", "n", "i", "a"],
      highestWPM: Number.isFinite(progressData.highestWPM)
        ? progressData.highestWPM
        : 0,
      lastSessionWPM: Number.isFinite(progressData.lastSessionWPM)
        ? progressData.lastSessionWPM
        : 0,
      createdAt: progressData.createdAt || nowISO(),
      lastUpdated: progressData.lastUpdated || nowISO(),
    };
  }

  // Return default progress for new users
  return {
    unlockedLetters: ["e", "n", "i", "a"], // Initially unlocked 4 letters
    highestWPM: 0,
    lastSessionWPM: 0,
    createdAt: nowISO(),
    lastUpdated: nowISO(),
  };
}

// Update unlocked letters in session
export function updateUnlockedLettersSession(username, unlockedLetters) {
  if (!username) return false;
  const progress = getUserProgressSession(username);
  const safeUnlocked = Array.isArray(unlockedLetters)
    ? unlockedLetters
    : progress.unlockedLetters || [];
  progress.unlockedLetters = safeUnlocked;
  progress.lastUpdated = nowISO();
  return writeSessionKey(username, progress);
}

// Update WPM in session
export function updateWPMSession(username, wpm) {
  if (!username || !Number.isFinite(wpm)) return false;
  const progress = getUserProgressSession(username);
  progress.lastSessionWPM = wpm;
  progress.highestWPM = Math.max(progress.highestWPM || 0, wpm);
  progress.lastUpdated = nowISO();
  return writeSessionKey(username, progress);
}

// Check if user uses session storage (new user)
export function isSessionUser(username) {
  if (!username) return false;
  return sessionStorage.getItem(`userProgress_${username}`) !== null;
}

/* ---------------- Local (persistent) storage functions ---------------- */

// Save user progress to localStorage (for existing users)
export function saveUserProgress(username, unlockedLetters, highestWPM = 0) {
  if (!username) return false;

  const users = readUsers();

  if (!users[username]) {
    users[username] = {
      unlockedLetters: [],
      highestWPM: 0,
      lastSessionWPM: 0,
      createdAt: nowISO(),
    };
  }

  // Ensure unlockedLetters is an array
  users[username].unlockedLetters = Array.isArray(unlockedLetters)
    ? unlockedLetters
    : users[username].unlockedLetters || [];

  // Update highest WPM only if new WPM is higher
  if (Number.isFinite(highestWPM) && highestWPM > (users[username].highestWPM || 0)) {
    users[username].highestWPM = highestWPM;
  }

  users[username].lastUpdated = nowISO();

  writeUsers(users);
  return true;
}

// Get user progress from localStorage
export function getUserProgress(username) {
  if (!username) return null;
  const users = readUsers();
  const user = users[username];
  if (user && typeof user === "object") {
    return {
      unlockedLetters: Array.isArray(user.unlockedLetters) ? user.unlockedLetters : [],
      highestWPM: Number.isFinite(user.highestWPM) ? user.highestWPM : 0,
      lastSessionWPM: Number.isFinite(user.lastSessionWPM) ? user.lastSessionWPM : 0,
      createdAt: user.createdAt || null,
      lastUpdated: user.lastUpdated || null,
      sessionHistory: Array.isArray(user.sessionHistory) ? user.sessionHistory : [],
    };
  }

  return {
    unlockedLetters: [],
    highestWPM: 0,
    lastSessionWPM: 0,
    createdAt: null,
    lastUpdated: null,
  };
}

// Save last completed session WPM to localStorage
export function saveLastSessionWPM(username, wpm) {
  if (!username || !Number.isFinite(wpm)) return false;
  const users = readUsers();

  if (users[username]) {
    users[username].lastSessionWPM = wpm;
    users[username].lastUpdated = nowISO();
    writeUsers(users);
    return true;
  }
  return false;
}

// Get last session WPM from localStorage
export function getLastSessionWPM(username) {
  const progress = getUserProgress(username);
  return progress ? progress.lastSessionWPM || 0 : 0;
}

// Update highest WPM for user
export function updateHighestWPM(username, wpm) {
  if (!username || !Number.isFinite(wpm)) return false;
  const progress = getUserProgress(username);
  if (!progress) return false;
  if (wpm > (progress.highestWPM || 0)) {
    // preserve unlockedLetters when saving new highestWPM
    saveUserProgress(username, progress.unlockedLetters || [], wpm);
    return true; // New record!
  }
  return false;
}

/* ---------------- Session history ---------------- */

// Save session history to sessionStorage (for new users)
export function saveSessionHistorySession(username, sessionData) {
  if (!username) return false;
  const sessions = getSessionHistorySession(username);
  sessions.push(sessionData);
  // Keep only last MAX_SESSIONS sessions to prevent storage bloat
  while (sessions.length > MAX_SESSIONS) {
    sessions.shift();
  }
  try {
    sessionStorage.setItem(`sessionHistory_${username}`, JSON.stringify(sessions));
    return true;
  } catch (e) {
    console.error("saveSessionHistorySession: failed to write to sessionStorage:", e);
    return false;
  }
}

// Get session history from sessionStorage
export function getSessionHistorySession(username) {
  if (!username) return [];
  const historyData = sessionStorage.getItem(`sessionHistory_${username}`);
  const parsed = safeParse(historyData);
  return Array.isArray(parsed) ? parsed : [];
}

// Save session history to localStorage (for existing users)
export function saveSessionHistory(username, sessionData) {
  if (!username) return false;
  const users = readUsers();
  if (!users[username]) {
    users[username] = {
      unlockedLetters: [],
      highestWPM: 0,
      lastSessionWPM: 0,
      sessionHistory: [],
      createdAt: nowISO(),
    };
  }

  if (!Array.isArray(users[username].sessionHistory)) {
    users[username].sessionHistory = [];
  }

  users[username].sessionHistory.push(sessionData);

  // Keep only last MAX_SESSIONS sessions
  while (users[username].sessionHistory.length > MAX_SESSIONS) {
    users[username].sessionHistory.shift();
  }

  users[username].lastUpdated = nowISO();
  writeUsers(users);
  return true;
}

// Get session history from localStorage
export function getSessionHistory(username) {
  if (!username) return [];
  const users = readUsers();
  return Array.isArray(users[username]?.sessionHistory) ? users[username].sessionHistory : [];
}
