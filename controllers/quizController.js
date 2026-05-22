// Quiz Controller
// Handles CRUD operations for quizzes

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const EventEmitter = require('events');

// Create event emitter for quiz events
const quizEvents = new EventEmitter();

// Get all quizzes
exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name email');
    
    res.render('quizzes', {
      title: 'Available Quizzes',
      quizzes,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz details
exports.getQuizDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findById(id).populate('createdBy', 'name email');
    if (!quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Quiz not found'
      });
    }
    
    const questions = await Question.find({ quizId: id });
    
    res.render('quizDetails', {
      title: quiz.title,
      quiz,
      questionsCount: questions.length,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create quiz page
exports.createQuizPage = (req, res) => {
  res.render('admin/addQuiz', {
    title: 'Add New Quiz',
    user: req.session
  });
};

// Admin: Create quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const { title, category, difficulty, totalMarks, timeLimit } = req.body;
    
    // Validation
    if (!title || !category || !difficulty || !totalMarks || !timeLimit) {
      return res.status(400).render('admin/addQuiz', {
        title: 'Add New Quiz',
        error: 'All fields are required',
        user: req.session
      });
    }
    
    // Create quiz
    const quiz = await Quiz.create({
      title,
      category,
      difficulty,
      totalMarks: parseInt(totalMarks),
      timeLimit: parseInt(timeLimit),
      createdBy: req.session.userId
    });
    
    // Emit quizCreated event
    quizEvents.emit('quizCreated', { quizId: quiz._id, title: quiz.title });
    console.log(`✓ Event: Quiz created - ${title}`);
    
    res.redirect(`/admin/quiz/${quiz._id}/questions`);
    
  } catch (error) {
    next(error);
  }
};

// Admin: Edit quiz page
exports.editQuizPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Quiz not found'
      });
    }
    
    res.render('admin/editQuiz', {
      title: 'Edit Quiz',
      quiz,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update quiz
exports.updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, difficulty, totalMarks, timeLimit } = req.body;
    
    // Validation
    if (!title || !category || !difficulty || !totalMarks || !timeLimit) {
      return res.status(400).render('admin/editQuiz', {
        title: 'Edit Quiz',
        error: 'All fields are required',
        user: req.session
      });
    }
    
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title,
        category,
        difficulty,
        totalMarks: parseInt(totalMarks),
        timeLimit: parseInt(timeLimit)
      },
      { new: true, runValidators: true }
    );
    
    if (!quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Quiz not found'
      });
    }
    
    res.redirect('/admin/quizzes');
    
  } catch (error) {
    next(error);
  }
};

// Admin: Delete quiz
exports.deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete quiz and associated questions
    const quiz = await Quiz.findByIdAndDelete(id);
    await Question.deleteMany({ quizId: id });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Get quizzes API endpoint
exports.getQuizzesAPI = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name');
    res.json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
