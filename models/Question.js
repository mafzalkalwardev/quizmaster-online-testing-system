// Question Model
// Stores quiz questions with multiple choice options

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required']
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    minlength: [5, 'Question must be at least 5 characters long']
  },
  optionA: {
    type: String,
    required: [true, 'Option A is required']
  },
  optionB: {
    type: String,
    required: [true, 'Option B is required']
  },
  optionC: {
    type: String,
    required: [true, 'Option C is required']
  },
  optionD: {
    type: String,
    required: [true, 'Option D is required']
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    enum: {
      values: ['A', 'B', 'C', 'D'],
      message: 'Correct answer must be A, B, C, or D'
    }
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1']
  }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
