import { apiConnector } from "../apiConnector"

const QUIZ_API = "https://studyhub-backend-bc8i.onrender.com/api/v1/quiz"

export const fetchQuizHistory = async (token) => {
  try {
    const res = await apiConnector(
      "GET",
      `${QUIZ_API}/history`, // ✅ use QUIZ_API
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    return res?.data?.data
  } catch (err) {
    console.error("Failed to fetch quiz history", err)
    return []
  }
}

export const saveQuizResult = async (token, resultData) => {
  try {
    const response = await apiConnector(
      "POST",
      `${QUIZ_API}/submit`, // ✅ use QUIZ_API
      resultData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("QUIZ RESULT SAVE RESPONSE: ", response?.data)
    return response?.data
  } catch (error) {
    console.error("Failed to save quiz result:", error)
    return null
  }
}
