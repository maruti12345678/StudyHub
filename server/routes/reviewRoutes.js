const express = require("express")
const router = express.Router()
const analyzeSentiment = require("../utils/sentimentAnalysis")

const reviews = [] // Temporary storage (Replace with DB in production)

router.post("/analyze-review", (req, res) => {
  const { courseId, reviewText } = req.body
  if (!courseId || !reviewText)
    return res.status(400).json({ error: "Required fields missing" })

  const sentimentResult = analyzeSentiment(reviewText)
  reviews.push({ courseId, text: reviewText, sentiment: sentimentResult })

  res.json({ message: "Review analyzed", sentiment: sentimentResult })
})

router.get("/reviews", (req, res) => res.json(reviews))

module.exports = router
