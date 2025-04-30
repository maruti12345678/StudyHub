const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const QuizResult = require("../models/QuizResult")
const Certificate = require("../models/Certificate")
const QuizTemplate = require("../models/QuizTemplate")

// Submit Quiz Result
exports.submitQuizResult = async (req, res) => {
  try {
    const { courseId, score, passed } = req.body
    const userId = req.user.id

    // Count previous attempts
    const attempts = await QuizResult.countDocuments({
      user: userId,
      course: courseId,
    })

    // Save quiz result
    const result = await QuizResult.create({
      user: userId,
      course: courseId,
      score,
      passed,
      attemptNumber: attempts + 1,
    })

    let certificate = null

    if (passed) {
      // Check if certificate already issued
      certificate = await Certificate.findOne({
        user: userId,
        course: courseId,
      })

      if (!certificate) {
        certificate = await Certificate.create({
          user: userId,
          course: courseId,
          certificateURL: "", // TODO: Add certificate PDF URL generation logic later
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: "Quiz result saved",
      result,
      certificateIssued: !!certificate,
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz result",
    })
  }
}

// Generate Quiz (Safe against duplicates)
exports.generateQuizWithGemini = async (req, res) => {
  try {
    const { courseDescription, courseId } = req.body

    if (!courseDescription || !courseId) {
      return res
        .status(400)
        .json({ message: "Missing course description or ID" })
    }

    // 1. Check if quiz already exists first
    const existingQuiz = await QuizTemplate.findOne({ course: courseId })
    if (existingQuiz) {
      return res.status(200).json({
        message: "Quiz already exists",
        questions: existingQuiz.questions,
      })
    }

    // 2. Otherwise, generate using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = `
      Generate 10 multiple choice quiz questions based on this course content:
      "${courseDescription}"

      Format:
      [
        {
          "question": "...",
          "options": ["...", "...", "...", "..."],
          "answer": "..."
        }
      ]
    `

    const result = await model.generateContent(prompt)
    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim()
    const questions = JSON.parse(raw)

    // 3. Save quiz to DB
    await QuizTemplate.create({
      course: courseId,
      questions,
    })

    console.log("✅ New quiz generated for course:", courseId)
    return res.status(200).json({ questions })
  } catch (error) {
    console.error("Quiz generation failed:", error.message)
    return res.status(500).json({
      message: "Quiz generation failed",
      error: error.message,
    })
  }
}

// Get Quiz History
exports.getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id

    const history = await QuizResult.find({ user: userId }).populate(
      "course",
      "courseName"
    )

    return res.status(200).json({
      success: true,
      data: history,
    })
  } catch (error) {
    console.error("Error fetching quiz history:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz history",
    })
  }
}
