const express = require("express")
const { auth } = require("../middleware/auth")
const router = express.Router()

const {
  generateQuizWithGemini,
} = require("../controllers/geminiQuizController")
const { submitQuizResult } = require("../controllers/geminiQuizController")
const {
  saveQuizResult,
  getQuizHistory,
} = require("../controllers/geminiQuizController")

router.post("/generate-gemini", generateQuizWithGemini)
router.post("/submit", auth, submitQuizResult)
router.get("/history", auth, getQuizHistory)

module.exports = router
