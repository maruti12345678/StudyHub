import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import CertificateComponent from "../components/core/Dashboard/CertificateComponent"
import QuizComponent from "../components/core/Dashboard/QuizComponent"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"

const QuizPage = () => {
  const { courseId } = useParams()
  const [quizPassed, setQuizPassed] = useState(false)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate() // Hook to navigate to the certificate page

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setCourse(res?.data?.courseDetails)
      } catch (error) {
        console.error("Error loading course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleQuizPass = () => {
    setQuizPassed(true)
    // Navigate to the certificate page after passing the quiz
    navigate(`/certificate/${courseId}`)
  }

  if (loading) {
    return (
      <div className="grid min-h-[80vh] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] p-6 text-white">
      <h2 className="mb-4 text-2xl font-bold">Course Quiz</h2>

      {!quizPassed && course ? (
        <QuizComponent
          courseId={courseId}
          courseDescription={course.courseDescription}
          onPass={handleQuizPass} // Pass the onPass callback to handle quiz pass
        />
      ) : quizPassed ? (
        <div className="text-center">
          <p className="text-green-500 mb-4 text-xl">
            Congratulations! You passed the quiz.
          </p>
          {/* Optional: Provide a button to navigate to certificate page */}
          <button
            onClick={() => navigate(`/certificate/${courseId}`)}
            className="mt-4 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Get Certificate
          </button>
        </div>
      ) : (
        <p className="text-red-500">Failed to load course info.</p>
      )}
    </div>
  )
}

export default QuizPage
