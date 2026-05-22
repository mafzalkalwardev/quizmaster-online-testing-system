// Attempt Controller
// Handles quiz attempts, answer submissions, and score calculation

const Attempt = require('../models/Attempt');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');
const EventEmitter = require('events');

// Create event emitter for attempt events
const attemptEvents = new EventEmitter();

// Start quiz attempt
exports.startQuiz = async (req, res, next) => {
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
    
    if (questions.length === 0) {
      return res.status(400).render('error', {
        statusCode: 400,
        message: 'This quiz has no questions yet'
      });
    }
    
    // Check if student already attempted this quiz
    const existingAttempt = await Attempt.findOne({
      studentId: req.session.userId,
      quizId
    });
    
    res.render('attemptQuiz', {
      title: `Attempt: ${quiz.title}`,
      quiz,
      questions,
      user: req.session,
      previousAttempt: existingAttempt ? true : false
    });
  } catch (error) {
    next(error);
  }
};

// Submit quiz attempt
exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const answers = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Quiz has no questions'
      });
    }
    
    // Calculate score
    let score = 0;
    questions.forEach((question) => {
      const questionIdStr = question._id.toString();
      if (answers[questionIdStr] === question.correctAnswer) {
        score += question.marks;
      }
    });
    
    // Calculate percentage
    const percentage = (score / quiz.totalMarks) * 100;
    
    // Create attempt record
    const attempt = await Attempt.create({
      studentId: req.session.userId,
      quizId,
      answers,
      score,
      totalQuestions: questions.length
    });
    
    // Get student and create result
    const student = await User.findById(req.session.userId);
    const result = await Result.create({
      studentName: student.name,
      quizTitle: quiz.title,
      score,
      totalMarks: quiz.totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      studentId: req.session.userId,
      quizId
    });
    
    // Emit quizSubmitted event
    attemptEvents.emit('quizSubmitted', {
      studentId: req.session.userId,
      quizId: quizId,
      score: score,
      percentage: percentage
    });
    console.log(`✓ Event: Quiz submitted - ${student.name} scored ${score}/${quiz.totalMarks}`);
    
    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      resultId: result._id,
      score,
      percentage: Math.round(percentage * 100) / 100,
      totalMarks: quiz.totalMarks
    });
    
  } catch (error) {
    next(error);
  }
};

// View result
exports.viewResult = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    
    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Result not found'
      });
    }
    
    res.render('result', {
      title: 'Quiz Result',
      result,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Get student's attempts
exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ studentId: req.session.userId })
      .populate('quizId', 'title')
      .sort({ attemptedAt: -1 });
    
    res.render('myAttempts', {
      title: 'My Quiz Attempts',
      attempts,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Get all results for a student
exports.getStudentResults = async (req, res, next) => {
  try {
    const results = await Result.find({ studentId: req.session.userId })
      .sort({ submittedAt: -1 });
    
    res.render('studentResults', {
      title: 'My Results',
      results,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
