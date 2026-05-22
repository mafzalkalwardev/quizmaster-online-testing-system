// Quiz Routes
// RESTful routes for quiz CRUD operations

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { isAuthenticated, isAdmin, isStudent } = require('../middleware/authMiddleware');

// Student routes
router.get('/', isAuthenticated, quizController.getAllQuizzes);
router.get('/:id', isAuthenticated, quizController.getQuizDetails);

// Admin routes
router.get('/admin/create', isAdmin, quizController.createQuizPage);
router.post('/admin/create', isAdmin, quizController.createQuiz);

router.get('/admin/:id/edit', isAdmin, quizController.editQuizPage);
router.put('/admin/:id/edit', isAdmin, quizController.updateQuiz);

router.delete('/admin/:id/delete', isAdmin, quizController.deleteQuiz);

// API routes
router.get('/api/all', quizController.getQuizzesAPI);

module.exports = router;
