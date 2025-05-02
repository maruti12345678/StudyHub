import axios from "axios"

export const fetchReviews = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/reviews")
    return response.data
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export const analyzeReview = async (courseId, reviewText) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/reviews/analyze-review",
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
