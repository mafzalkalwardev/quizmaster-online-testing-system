// Admin Controller
// Handles admin dashboard, analytics, and user management

const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Result = require('../models/Result');

// Admin dashboard
exports.adminDashboard = async (req, res, next) => {
  try {
    // Count statistics
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    
    // Get average score using aggregation
    const avgScoreResult = await Result.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$percentage' }
        }
      }
    ]);
    
    const averageScore = avgScoreResult.length > 0 
      ? Math.round(avgScoreResult[0].averageScore * 100) / 100 
      : 0;
    
    // Get most attempted quiz category
    const topCategoryResult = await Result.aggregate([
      {
        $group: {
          _id: '$quizTitle',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const topQuiz = topCategoryResult.length > 0 ? topCategoryResult[0]._id : 'N/A';
    
    res.render('admin/adminDashboard', {
      title: 'Admin Dashboard',
      stats: {
        totalStudents,
        totalQuizzes,
        totalAttempts,
        averageScore,
        topQuiz
      },
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// View all quizzes (admin)
exports.getAdminQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.render('admin/adminQuizzes', {
      title: 'Manage Quizzes',
      quizzes,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// View all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    
    res.render('admin/manageUsers', {
      title: 'Manage Students',
      students,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// View leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    // Aggregation pipeline to get top students by average score
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$studentName',
          studentId: { $first: '$studentId' },
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          totalScore: { $sum: '$score' }
        }
      },
      { $sort: { averageScore: -1 } },
      { $limit: 100 }
    ]);
    
    res.render('leaderboard', {
      title: 'Leaderboard',
      leaderboard,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// View analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total quiz attempts per quiz
    const attemptsPerQuiz = await Result.aggregate([
      {
        $group: {
          _id: '$quizTitle',
          attemptCount: { $sum: 1 },
          averageScore: { $avg: '$percentage' }
        }
      },
      { $sort: { attemptCount: -1 } }
    ]);
    
    // Top performing students
    const topStudents = await Result.aggregate([
      {
        $group: {
          _id: '$studentName',
          averageScore: { $avg: '$percentage' },
          totalAttempts: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } },
      { $limit: 10 }
    ]);
    
    // Score distribution
    const scoreDistribution = await Result.aggregate([
      {
        $bucket: {
          groupBy: '$percentage',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    
    res.render('admin/analytics', {
      title: 'Analytics',
      attemptsPerQuiz,
      topStudents,
      scoreDistribution,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz attempts for admin
exports.getQuizAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).render('error', {
        statusCode: 404,
        message: 'Quiz not found'
      });
    }
    
    const attempts = await Result.find({ quizId })
      .sort({ submittedAt: -1 });
    
    res.render('admin/quizAttempts', {
      title: `Attempts for ${quiz.title}`,
      quiz,
      attempts,
      user: req.session
    });
  } catch (error) {
    next(error);
  }
};

// API: Get admin stats
exports.getAdminStatsAPI = async (req, res, next) => {
  try {
    const stats = {
      totalStudents: await User.countDocuments({ role: 'student' }),
      totalAdmins: await User.countDocuments({ role: 'admin' }),
      totalQuizzes: await Quiz.countDocuments(),
      totalAttempts: await Attempt.countDocuments(),
      totalResults: await Result.countDocuments()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
