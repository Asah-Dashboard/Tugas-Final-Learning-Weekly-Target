// backend/server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./db/index');
const sessionStore = new MySQLStore({}, pool);
const compression = require('compression');

const app = express();
app.use(compression());
const PORT = process.env.PORT || 5001;

// CSP Middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
  next();
});

// CORS
app.use(cors({ origin: true, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  store: sessionStore, 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set true jika nanti pakai HTTPS
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Serve static files
const frontendPath = path.join(__dirname, '../frontend');
console.log('📁 Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// API Routes
app.use('/api', require('./routes/weeklyTargetRoutes'));
app.use('/api', require('./routes/learningLogRoutes'));
app.use('/api', require('./routes/dashboardRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/notificationRoutes'));
app.use('/api', require('./routes/pomodoroRoutes'));
app.use('/api', require('./routes/taskRoutes'));


// Ini wajib ada karena filenya ada di folder 'js', tapi browser minta di root
app.get('/OneSignalSDKWorker.js', (req, res) => {
  res.sendFile(path.join(frontendPath, 'js', 'OneSignalSDKWorker.js'));
});
app.get('/OneSignalSDKUpdaterWorker.js', (req, res) => {
  res.sendFile(path.join(frontendPath, 'js', 'OneSignalSDKUpdaterWorker.js'));
});

// Page Routes (fallback untuk SPA)
app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'dashboard.html')));
app.get('/login', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'register.html')));
app.get('/schedule', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'schedule.html'))); 
app.get('/about', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'about.html'))); 
app.get('/log_progress', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'log_progress.html')));
app.get('/tasks', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'tasks.html')));

// Initialize Scheduler
require('./services/schedulerService').initScheduler();

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
});