import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"

const MAX_RETRIES = 3

const QuizComponent = ({ onPass, courseId, courseDescription }) => {
  const { token } = useSelector((state) => state.auth)

  const [questions, setQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [cooldownEndTime, setCooldownEndTime] = useState(null)
  const [remainingTime, setRemainingTime] = useState(0)

  const [quizTimeLeft, setQuizTimeLeft] = useState(300) // 5-minute timer (300 seconds)

  // Fetch quiz questions
  const fetchQuiz = async () => {
    try {
      const res = await fetch(
        "https://study-hub-new.vercel.app/api/v1/quiz/generate-gemini",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseDescription, courseId }),
        }
      )

      if (!res.ok) {
        const errText = await res.text()
        console.error("Server returned error:", errText)
        throw new Error("Quiz generation failed")
      }

      const data = await res.json()
      console.log("Quiz questions received:", data)

      if (data.questions) {
        setQuestions(data.questions)
      } else {
        setError(data?.error || "Quiz generation failed.")
      }
    } catch (err) {
      console.error("Failed to fetch quiz questions:", err)
      setError("Something went wrong while generating the quiz.")
    }
  }

  // Manage cooldown timer
  useEffect(() => {
    if (!cooldownEndTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const timeLeft = Math.max(0, Math.floor((cooldownEndTime - now) / 1000))
      setRemainingTime(timeLeft)

      if (timeLeft <= 0) {
        clearInterval(interval)
        setCooldownEndTime(null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldownEndTime])

  // Manage quiz timer (5 minutes)
  useEffect(() => {
    if (quizTimeLeft <= 0) {
      handleTimeoutSubmit()
      return
    }

    const interval = setInterval(() => {
      setQuizTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [quizTimeLeft])

  // Handle timeout and submit quiz if time is up
  const handleTimeoutSubmit = () => {
    if (!isSubmitted) {
      setIsSubmitted(true)
      setScore(0) // Score will be 0 if time runs out
      setPassed(false)
      toast.error("Time's up! You failed the quiz.")
      handleSubmit()
    }
  }

  useEffect(() => {
    fetchQuiz()
  }, [courseDescription])

  // Handle answer selection
  const handleOptionSelect = (index, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [index]: option,
    }))
  }

  // Submit quiz
  const handleSubmit = async () => {
    if (!Array.isArray(questions) || questions.length === 0) return

    setIsSubmitting(true)

    let calculatedScore = 0
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) calculatedScore++
    })

    const percentage = (calculatedScore / questions.length) * 100
    const hasPassed = percentage >= 70

    setScore(percentage)
    setPassed(hasPassed)
    setIsSubmitted(true)

    if (!hasPassed) {
      const cooldownPeriod = 10 // 10 seconds cooldown now
      const endTime = Date.now() + cooldownPeriod * 1000
      setCooldownEndTime(endTime)
      toast.error("Cooldown started. Please wait before retrying.")
    }

    try {
      const res = await fetch(
        "https://study-hub-new.vercel.app/api/v1/quiz/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId,
            score: percentage,
            passed: hasPassed,
          }),
        }
      )

      const data = await res.json()

      if (res.ok) {
        toast.success("Quiz submitted successfully!")
        if (data.certificateIssued && onPass) {
          onPass()
        }
      } else {
        toast.error(data.message || "Quiz submission failed")
      }
    } catch (err) {
      console.error("Quiz submission error:", err)
      toast.error("Server error while submitting quiz")
    }

    setIsSubmitting(false)
  }

  // Handle retry
  const handleRetry = async () => {
    if (retryCount >= MAX_RETRIES - 1) {
      toast.error("Maximum retries reached. Please try again later.")
      return
    }

    setRetryCount((prev) => prev + 1)
    setSelectedAnswers({})
    setIsSubmitted(false)
    setScore(0)
    setPassed(false)
    setError("")
    await fetchQuiz()
  }

  // Error Handling
  if (!questions.length && error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error.includes("429")
          ? "Quiz generation failed due to API quota limits. Please try again later."
          : "Quiz could not be generated."}
      </div>
    )
  }

  // Loading State
  if (!questions.length && !error) {
    return (
      <div className="animate-pulse p-4 text-center text-white">
        Generating quiz...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-2xl font-semibold text-black">Course Quiz</h2>

      {/* Timer */}
      <div className="mb-4 text-center">
        <p className="text-lg text-black">
          Time Left: {Math.floor(quizTimeLeft / 60)}:
          {(quizTimeLeft % 60).toString().padStart(2, "0")}
        </p>
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-medium text-black">
            {index + 1}. {q.question}
          </p>
          <div className="mt-2 space-y-2">
            {q.options.map((option, i) => (
              <label key={i} className="block text-black">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleOptionSelect(index, option)}
                  disabled={isSubmitted}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Submit / Retry Section */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </button>
      ) : (
        <div className="mt-6 text-center">
          {passed ? (
            <>
              <p className="mb-2 text-2xl font-semibold text-black">
                🎉 Congratulations! You passed!
              </p>
              <p className="mb-4 text-black">Your score: {score.toFixed(2)}%</p>
            </>
          ) : (
            <>
              <p className="mb-2 text-2xl font-semibold text-black">
                ❌ You have failed the quiz.
              </p>
              <p className="mb-4 text-black">Your score: {score.toFixed(2)}%</p>

              {/* Retry Button */}
              {retryCount < MAX_RETRIES && (
                <button
                  onClick={handleRetry}
                  disabled={cooldownEndTime && remainingTime > 0}
                  className="disabled:bg-gray-600 mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed"
                >
                  {cooldownEndTime && remainingTime > 0
                    ? `Retry available in ${remainingTime}s`
                    : `Retry Quiz (${
                        MAX_RETRIES - retryCount - 1
                      } attempts left)`}
                </button>
              )}

              {/* Max Retry Reached */}
              {retryCount >= MAX_RETRIES && (
                <p className="mt-2 font-semibold text-black">
                  Maximum retries reached. Please contact support or your
                  instructor.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default QuizComponent
