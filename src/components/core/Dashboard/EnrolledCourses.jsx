import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { toast } from "react-hot-toast"
import { FaCheckCircle, FaSpinner } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchAllCertificates } from "../../../services/operations/certificateAPI"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [userCertificates, setUserCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch enrolled courses + certificates
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) return

        // Fetch enrolled courses
        const courses = await getUserEnrolledCourses(token)
        const publishedCourses = courses.filter((c) => c.status !== "Draft")
        setEnrolledCourses(publishedCourses)

        // Fetch certificates
        const certificates = await fetchAllCertificates(token)
        console.log("Certificates fetched:", certificates)
        setUserCertificates(certificates)
      } catch (error) {
        console.error("Error loading enrolled courses or certificates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  // Helper to check if user has certificate for a course
  const hasCertificate = (courseId) => {
    return userCertificates.some(
      (cert) =>
        cert.course?._id?.toString() === courseId.toString() ||
        cert.course?.toString() === courseId.toString()
    )
  }

  // Navigate to certificate page
  const handleGetCertificate = (courseId) => {
    navigate(`/certificate/${courseId}`)
  }

  return (
    <>
      <div className="text-2xl font-semibold text-richblack-50 sm:text-3xl">
        Enrolled Courses
      </div>

      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <FaSpinner className="animate-spin text-3xl text-yellow-400" />
        </div>
      ) : !enrolledCourses?.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Table Head */}
          <div className="hidden rounded-t-lg bg-richblack-500 text-sm sm:flex">
            <p className="w-[30%] px-5 py-3">Course Name</p>
            <p className="w-[15%] px-2 py-3">Duration</p>
            <p className="w-[25%] px-2 py-3">Progress</p>
            <p className="w-[15%] px-2 py-3">Take Quiz</p>
            <p className="w-[15%] px-2 py-3">Get Certificate</p>
          </div>

          {/* Course Rows */}
          {enrolledCourses.map((course, index, arr) => (
            <div
              key={course._id}
              className={`flex flex-col items-start border border-richblack-700 sm:flex-row sm:items-center ${
                index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
            >
              {/* Course Info */}
              <div
                className="flex w-full cursor-pointer items-center gap-4 px-5 py-3 sm:w-[30%]"
                onClick={() =>
                  navigate(
                    `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover sm:h-16 sm:w-16"
                />
                <div className="flex max-w-full flex-col gap-1 sm:max-w-xs">
                  <p className="text-sm font-semibold sm:text-base">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription?.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-full px-5 py-3 text-sm sm:w-[15%] sm:px-2 sm:text-base">
                {course?.totalDuration}
              </div>

              {/* Progress */}
              <div className="flex w-full flex-col gap-2 px-5 py-3 sm:w-[22%] sm:px-2">
                <p className="text-sm sm:text-base">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>

              {/* Take Quiz */}
              <div className="flex w-full items-center justify-center px-5 py-3 sm:w-[15%]">
                <button
                  onClick={() => {
                    if (course.progressPercentage === 100) {
                      navigate(`/course/${course._id}/quiz`)
                    } else {
                      toast.error("Complete all lectures first.")
                    }
                  }}
                  className={`mt-2 w-fit rounded px-3 py-1 text-sm font-medium ${
                    course.progressPercentage === 100
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "cursor-not-allowed bg-richblack-600 text-white"
                  }`}
                >
                  Take Quiz
                </button>
              </div>

              {/* Get Certificate */}
              <div className="flex w-full items-center justify-center px-5 py-3 sm:w-[18%]">
                <button
                  disabled={!hasCertificate(course._id)}
                  onClick={() => handleGetCertificate(course._id)}
                  className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    hasCertificate(course._id)
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "text-gray-400 cursor-not-allowed bg-richblack-600"
                  }`}
                >
                  {hasCertificate(course._id) ? (
                    <>
                      <FaCheckCircle className="text-black" />
                      Get Certificate
                    </>
                  ) : (
                    "Get Certificate"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
