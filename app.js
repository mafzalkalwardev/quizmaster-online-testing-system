// QuizMaster - Online Testing System
// Main Application File
// Built with Node.js, Express, MongoDB, and EJS

const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');

// Import middleware
const loggerMiddleware = require('./middleware/loggerMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ==================== APPLICATION SETUP ====================
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ==================== MIDDLEWARE ====================

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'quizmaster-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logger middleware
app.use(loggerMiddleware);

// ==================== ROUTES ====================

// Home page
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        user: req.session 
    });
});

// Authentication routes
app.use(authRoutes);

// Quiz routes
app.use('/quizzes', quizRoutes);

// Question routes
app.use('/questions', questionRoutes);

// Attempt routes
app.use(attemptRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('error', {
        statusCode: 404,
        message: 'Page not found. Please check the URL and try again.'
    });
});

// Error middleware (must be last)
app.use(errorMiddleware);

// ==================== SERVER STARTUP ====================
app.listen(PORT, () => {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                  QUIZMASTER SERVER                    ║');
    console.log('║            Online Testing System v1.0.0               ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('\n');
    console.log(`✓ Server running at http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ MongoDB: mongodb://127.0.0.1:27017/quizmasterDB`);
    console.log(`✓ Views: ${path.join(__dirname, 'views')}`);
    console.log(`✓ Static files: ${path.join(__dirname, 'public')}`);
    console.log('\n');
    console.log('📝 Group Members:');
    console.log('   • Muhammad Afzal Kalwar');
    console.log('   • Ayesha Bibi');
    console.log('   • Hafsa Kanwal Awan');
    console.log('\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});

module.exports = app;
