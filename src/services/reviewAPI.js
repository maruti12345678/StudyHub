import axios from "axios"

export const fetchReviews = async () => {
  try {
    const response = await axios.get("https://studyhub-backend-bc8i.onrender.com/api/reviews")
    return response.data
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export const analyzeReview = async (courseId, reviewText) => {
  try {
    const response = await axios.post(
      "https://studyhub-backend-bc8i.onrender.com/api/reviews/analyze-review",
      {
        courseId,
        reviewText,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error analyzing review:", error)
    return null
  }
}
