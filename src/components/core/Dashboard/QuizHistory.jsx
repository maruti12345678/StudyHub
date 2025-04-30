import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { fetchQuizHistory } from "../../../services/operations/quizAPI"

export default function QuizHistory() {
  const { token } = useSelector((state) => state.auth)
  const [quizHistory, setQuizHistory] = useState([])
  const [courseTitles, setCourseTitles] = useState({})
  const [loading, setLoading] = useState(true)
  const MAX_RETRIES = 3

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const history = await fetchQuizHistory(token)
        setQuizHistory(history || [])

        const enrolledCourses = await getUserEnrolledCourses(token)
        const titlesMap = {}
        enrolledCourses.forEach((course) => {
          titlesMap[course._id] = course.courseName
        })
        setCourseTitles(titlesMap)
      } catch (error) {
        console.error("Error loading quiz history:", error)
      } finally {
        setLoading(false)
      }
    }
    if (token) {
      load()
    }
  }, [token])

  if (loading) {
    return (
      <div className="mt-20 animate-pulse text-center text-white">
        Loading your quiz history...
      </div>
    )
  }

  if (!quizHistory.length) {
    return (
      <div className="mt-20 text-center text-white">
        You haven't taken any quizzes yet.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">
        📜 Your Quiz Attempts
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {quizHistory.map((entry, idx) => {
          const courseId =
            typeof entry.courseId === "string"
              ? entry.courseId
              : entry.courseId?._id
          const courseName =
            courseTitles[courseId] ||
            entry?.course?.courseName ||
            "Unknown Course"

          const attemptsLeft = MAX_RETRIES - (entry.attemptNumber || 1)

          return (
            <div
              key={idx}
              className="rounded-xl bg-richblack-700 p-6 shadow-md ring-2 ring-transparent transition-all hover:shadow-lg hover:ring-yellow-400"
            >
              <h3 className="mb-2 text-xl font-semibold text-white">
                {courseName}
              </h3>

              <div className="flex flex-col gap-1 text-sm text-white">
                <p>Attempt #{entry.attemptNumber || 1}</p>
                <p>Submitted: {new Date(entry.submittedAt).toLocaleString()}</p>
                <p>Score: {entry.score?.toFixed(2)}%</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      entry.passed ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {entry.passed ? "Passed ✅" : "Failed ❌"}
                  </span>
                </p>
                {attemptsLeft > 0 && (
                  <p className="text-yellow-400">
                    Attempts left: {attemptsLeft}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
