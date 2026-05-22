// Attempt Model
// Records each student's quiz attempt with answers and scores

const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required']
  },
  answers: {
    type: Map,
    of: String,
    default: new Map()
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

const Attempt = mongoose.model('Attempt', attemptSchema);
module.exports = Attempt;
