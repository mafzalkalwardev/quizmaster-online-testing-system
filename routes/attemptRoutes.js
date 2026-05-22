// Attempt Routes
// Routes for quiz attempts and results

const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const { isAuthenticated, isStudent } = require('../middleware/authMiddleware');

// Student routes
router.get('/quiz/:quizId/start', isStudent, attemptController.startQuiz);
router.post('/quiz/:quizId/submit', isStudent, attemptController.submitQuiz);

router.get('/result/:resultId', isAuthenticated, attemptController.viewResult);
router.get('/my-attempts', isStudent, attemptController.getMyAttempts);
router.get('/my-results', isStudent, attemptController.getStudentResults);

module.exports = router;
