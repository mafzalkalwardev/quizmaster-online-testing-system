// Question Controller
// Handles CRUD operations for quiz questions

const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Get questions for a quiz
exports.getQuestionsByQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Quiz not found'
      });
    }
    
    const questions = await Question.find({ quizId });
    
    res.render('admin/manageQuestions', {
      title: 'Manage Questions',
      quiz,
      questions,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Add question page
exports.addQuestionPage = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Quiz not found'
      });
    }
    
    res.render('admin/addQuestion', {
      title: 'Add Question',
      quiz,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Create question
exports.createQuestion = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer, marks } = req.body;
    
    // Validation
    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !marks) {
      const quiz = await Quiz.findById(quizId);
      return res.status(400).render('admin/addQuestion', {
        title: 'Add Question',
        error: 'All fields are required',
        quiz,
        user: req.session
      });
    }
    
    // Create question
    const question = await Question.create({
      quizId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks: parseInt(marks)
    });
    
    res.redirect(`/admin/quiz/${quizId}/questions`);
    
  } catch (error) {
    next(error);
  }
};

// Edit question page
exports.editQuestionPage = async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    const question = await Question.findById(questionId);
    
    if (!question || !quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Question or quiz not found'
      });
    }
    
    res.render('admin/editQuestion', {
      title: 'Edit Question',
      quiz,
      question,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Update question
exports.updateQuestion = async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer, marks } = req.body;
    
    // Validation
    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !marks) {
      const quiz = await Quiz.findById(quizId);
      const question = await Question.findById(questionId);
      return res.status(400).render('admin/editQuestion', {
        title: 'Edit Question',
        error: 'All fields are required',
        quiz,
        question,
        user: req.session
      });
    }
    
    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        marks: parseInt(marks)
      },
      { new: true, runValidators: true }
    );
    
    if (!question) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Question not found'
      });
    }
    
    res.redirect(`/admin/quiz/${quizId}/questions`);
    
  } catch (error) {
    next(error);
  }
};

// Delete question
exports.deleteQuestion = async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    
    const question = await Question.findByIdAndDelete(questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
