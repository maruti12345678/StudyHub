import React, { useState } from "react"
import Sentiment from "sentiment"

import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

const SentimentAnalysis = () => {
  const [courseName, setCourseName] = useState("")
  const [reviews, setReviews] = useState([])
  const [reviewCount, setReviewCount] = useState(0)
  const [sentimentScore, setSentimentScore] = useState(null)
  const [emoji, setEmoji] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const fetchReviews = async () => {
    if (!courseName.trim()) {
      setErrorMessage("Please enter a course name.")
      return
    }

    setLoading(true)
    setErrorMessage("")
    setReviews([])
    setSentimentScore(null)

    try {
      const response = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (response?.data?.success) {
        const courseReviews = response.data.data.filter(
          (review) =>
            review.course.courseName.toLowerCase() === courseName.toLowerCase()
        )

        setReviews(courseReviews)
        setReviewCount(courseReviews.length)

        if (courseReviews.length === 0) {
          setErrorMessage("No reviews found for this course.")
        } else {
          analyzeSentiment(courseReviews)
        }
      }
    } catch (error) {
      setErrorMessage("Error fetching course reviews. Please try again.")
      console.error("Error fetching course reviews:", error)
    }

    setLoading(false)
  }

  const analyzeSentiment = (courseReviews) => {
    if (!courseReviews || courseReviews.length === 0) {
      setSentimentScore(null)
      setEmoji("❌")
      return
    }

    const sentiment = new Sentiment()
    let totalScore = 0

    courseReviews.forEach((review) => {
      const analysis = sentiment.analyze(review.review)
      totalScore += analysis.score
    })

    const avgScore = totalScore / courseReviews.length
    const normalizedScore = Math.round(((avgScore + 5) / 10) * 10) // Convert -5 to +5 into 0 to 10

    setSentimentScore(normalizedScore)
    setEmoji(getEmoji(normalizedScore))
  }

  const getEmoji = (score) => {
    if (score >= 9) return "😁"
    if (score >= 7) return "😊"
    if (score >= 5) return "😐"
    if (score >= 3) return "☹️"
    if (score >= 1) return "😢"
    return "😡"
  }

  return (
    <div className="bg-gray-100 flex min-h-screen w-full flex-col items-center p-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-gray-800 mb-4 text-center text-xl font-bold">
          Sentiment Analysis
        </h2>

        <input
          type="text"
          placeholder="Enter Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mb-4 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={fetchReviews}
          disabled={loading || !courseName.trim()}
          className={`w-full rounded-lg py-2 text-white ${
            loading || !courseName.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Loading..." : "Analyze Sentiment"}
        </button>

        {errorMessage && (
          <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
        )}

        {sentimentScore !== null && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">
              Sentiment Score: {sentimentScore}/10 {emoji}
            </h3>
            <p className="text-gray-600">Total Reviews: {reviewCount}</p>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Reviews:</h3>
            <ul className="text-gray-700 list-disc pl-5">
              {reviews.map((review, index) => (
                <li key={index} className="mb-2">
                  {review.review}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SentimentAnalysis
