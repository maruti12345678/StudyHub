import axios from "axios"

export const fetchReviews = async () => {
  try {
    const response = await axios.get(
      "https://study-hub-new.vercel.app/api/reviews"
    )
    return response.data
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export const analyzeReview = async (courseId, reviewText) => {
  try {
    const response = await axios.post(
      "https://study-hub-new.vercel.app/api/reviews/analyze-review",
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
