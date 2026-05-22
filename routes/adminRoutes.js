// Admin Routes
// Routes for admin dashboard and management

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

// Admin dashboard
router.get('/dashboard', isAdmin, adminController.adminDashboard);

// Quiz management
router.get('/quizzes', isAdmin, adminController.getAdminQuizzes);

// Student management
router.get('/students', isAdmin, adminController.getAllStudents);

// Leaderboard
router.get('/leaderboard', adminController.getLeaderboard);

// Analytics
router.get('/analytics', isAdmin, adminController.getAnalytics);

// Quiz attempts
router.get('/quiz/:quizId/attempts', isAdmin, adminController.getQuizAttempts);

// API routes
router.get('/api/stats', isAdmin, adminController.getAdminStatsAPI);

module.exports = router;
