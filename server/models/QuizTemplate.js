const mongoose = require("mongoose")

const quizTemplateSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true, // Only one quiz per course
  },
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("QuizTemplate", quizTemplateSchema)
