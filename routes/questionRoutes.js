// Question Routes
// Routes for managing quiz questions

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { isAdmin } = require('../middleware/authMiddleware');

// Admin routes for questions
router.get('/quiz/:quizId/questions', isAdmin, questionController.getQuestionsByQuiz);

router.get('/quiz/:quizId/add', isAdmin, questionController.addQuestionPage);
router.post('/quiz/:quizId/add', isAdmin, questionController.createQuestion);

router.get('/quiz/:quizId/:questionId/edit', isAdmin, questionController.editQuestionPage);
router.put('/quiz/:quizId/:questionId/edit', isAdmin, questionController.updateQuestion);

router.delete('/quiz/:quizId/:questionId/delete', isAdmin, questionController.deleteQuestion);

module.exports = router;
