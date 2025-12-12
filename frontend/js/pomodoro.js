// Pomodoro Timer Implementation
// API_BASE is defined in config.js - use window.API_BASE to avoid redeclaration errors
var API_BASE = window.API_BASE || "http://localhost:5001/api";
var USER_ID = localStorage.getItem('user_id');

// Timer durations in seconds
const TIMER_DURATIONS = {
    work: 25 * 60,      // 25 minutes
    shortBreak: 5 * 60,  // 5 minutes
    longBreak: 15 * 60   // 15 minutes
};

// State
let currentMode = 'work';
let timeLeft = TIMER_DURATIONS.work;
let timerInterval = null;
let isRunning = false;
let isPaused = false;

// DOM Elements
const timerMinutesEl = document.getElementById('timerMinutes');
const timerSecondsEl = document.getElementById('timerSeconds');
const timerProgressEl = document.querySelector('.timer-progress');
const timerCircleEl = document.querySelector('.timer-circle');
const timerStatusEl = document.getElementById('timerStatus');
const todaySessionsEl = document.getElementById('todaySessions');
const totalSessionsEl = document.getElementById('totalSessions');
const startBtn = document.getElementById('pomodoroStart');
const pauseBtn = document.getElementById('pomodoroPause');
const resetBtn = document.getElementById('pomodoroReset');
const modeButtons = document.querySelectorAll('.mode-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    setupEventListeners();
    // Initialize progress circle
    const circumference = 2 * Math.PI * 90;
    timerProgressEl.style.strokeDasharray = circumference;
    timerProgressEl.style.strokeDashoffset = 0;
    updateDisplay();
});

function setupEventListeners() {
    // Mode buttons
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isRunning) {
                if (!confirm('Timer sedang berjalan. Ganti mode akan mereset timer. Lanjutkan?')) {
                    return;
                }
            }
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });

    // Control buttons
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

function switchMode(mode) {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = false;
    }

    currentMode = mode;
    timeLeft = TIMER_DURATIONS[mode];

    // Update active button
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update progress color
    timerProgressEl.className = 'timer-progress ' + mode;

    updateDisplay();
    updateButtons();
    updateStatus();
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    isPaused = false;
    updateButtons();
    updateStatus();

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            completeTimer();
        }
    }, 1000);

    // Add pulsing animation
    timerCircleEl.classList.add('pulsing');
}

function pauseTimer() {
    if (!isRunning) return;

    clearInterval(timerInterval);
    isRunning = false;
    isPaused = true;
    updateButtons();
    updateStatus();
    timerCircleEl.classList.remove('pulsing');
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    timeLeft = TIMER_DURATIONS[currentMode];
    updateDisplay();
    updateButtons();
    updateStatus();
    timerCircleEl.classList.remove('pulsing');
}

function completeTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    timerCircleEl.classList.remove('pulsing');

    // Play notification sound
    playNotificationSound();

    // Show notification
    showNotification();

    // If work session completed, increment stats
    if (currentMode === 'work') {
        incrementSessionStats();
    }

    // Auto switch to break after work session
    if (currentMode === 'work') {
        // Check if it's time for long break (every 4 sessions)
        const todaySessions = parseInt(todaySessionsEl.textContent) || 0;
        const nextMode = (todaySessions % 4 === 0) ? 'longBreak' : 'shortBreak';
        
        setTimeout(() => {
            if (confirm('Sesi belajar selesai! Ingin istirahat sekarang?')) {
                switchMode(nextMode);
                startTimer();
            } else {
                resetTimer();
            }
        }, 1000);
    } else {
        // Break finished, reset to work mode
        setTimeout(() => {
            switchMode('work');
            updateStatus();
        }, 1000);
    }

    updateButtons();
    updateStatus();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerMinutesEl.textContent = String(minutes).padStart(2, '0');
    timerSecondsEl.textContent = String(seconds).padStart(2, '0');

    // Update progress circle (radius = 90, circumference = 2πr)
    const total = TIMER_DURATIONS[currentMode];
    const elapsed = total - timeLeft;
    const percentage = Math.min(100, (elapsed / total) * 100);
    const circumference = 2 * Math.PI * 90; // radius = 90 from SVG
    const offset = circumference - (percentage / 100) * circumference;
    
    timerProgressEl.style.strokeDasharray = circumference;
    timerProgressEl.style.strokeDashoffset = offset;
}

function updateButtons() {
    if (isRunning) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    } else {
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }
}

function updateStatus() {
    const modeNames = {
        work: 'Sesi Belajar',
        shortBreak: 'Istirahat Pendek',
        longBreak: 'Istirahat Panjang'
    };

    if (isRunning) {
        timerStatusEl.textContent = `⏱️ ${modeNames[currentMode]} sedang berjalan...`;
    } else if (isPaused) {
        timerStatusEl.textContent = `⏸️ Timer dijeda`;
    } else {
        timerStatusEl.textContent = `🎯 Siap untuk ${modeNames[currentMode].toLowerCase()}!`;
    }
}

function playNotificationSound() {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function showNotification() {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        const modeNames = {
            work: 'Sesi Belajar',
            shortBreak: 'Istirahat Pendek',
            longBreak: 'Istirahat Panjang'
        };
        
        new Notification('🍅 Pomodoro Timer', {
            body: `${modeNames[currentMode]} selesai!`,
            icon: '🍅'
        });
    }

    // Visual notification on page
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 1.5rem;
        font-weight: bold;
        animation: popIn 0.3s ease-out;
        text-align: center;
    `;
    
    const modeNames = {
        work: 'Sesi Belajar',
        shortBreak: 'Istirahat Pendek',
        longBreak: 'Istirahat Panjang'
    };
    
    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 10px;">🍅</div>
        <div>${modeNames[currentMode]} Selesai!</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'popOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 2000);

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        from {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes popOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Stats Management
async function incrementSessionStats() {
    try {
        // Update UI immediately
        const todaySessions = parseInt(todaySessionsEl.textContent) || 0;
        const totalSessions = parseInt(totalSessionsEl.textContent) || 0;
        
        todaySessionsEl.textContent = todaySessions + 1;
        totalSessionsEl.textContent = totalSessions + 1;

        // Save to backend
        if (USER_ID) {
            const response = await fetch(`${API_BASE}/pomodoro/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_id: USER_ID,
                    mode: currentMode
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Update with actual stats from server
                if (data.stats) {
                    todaySessionsEl.textContent = data.stats.today_sessions || todaySessions + 1;
                    totalSessionsEl.textContent = data.stats.total_sessions || totalSessions + 1;
                }
            }
        } else {
            // Fallback to localStorage if no user
            const stats = JSON.parse(localStorage.getItem('pomodoro_stats') || '{}');
            const today = new Date().toDateString();
            stats[today] = (stats[today] || 0) + 1;
            stats.total = (stats.total || 0) + 1;
            localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
        }
    } catch (error) {
        console.error('Error saving Pomodoro session:', error);
    }
}

async function loadStats() {
    try {
        if (USER_ID) {
            const response = await fetch(`${API_BASE}/pomodoro/stats?user_id=${USER_ID}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.stats) {
                    todaySessionsEl.textContent = data.stats.today_sessions || 0;
                    totalSessionsEl.textContent = data.stats.total_sessions || 0;
                    return;
                }
            }
        }

        // Fallback to localStorage
        const stats = JSON.parse(localStorage.getItem('pomodoro_stats') || '{}');
        const today = new Date().toDateString();
        todaySessionsEl.textContent = stats[today] || 0;
        totalSessionsEl.textContent = stats.total || 0;
    } catch (error) {
        console.error('Error loading Pomodoro stats:', error);
        // Use localStorage fallback
        const stats = JSON.parse(localStorage.getItem('pomodoro_stats') || '{}');
        const today = new Date().toDateString();
        todaySessionsEl.textContent = stats[today] || 0;
        totalSessionsEl.textContent = stats.total || 0;
    }
}

