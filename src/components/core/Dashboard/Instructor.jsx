import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) setCourses(result)
      setLoading(false)
    }

    fetchData()
  }, [token]) // Added dependency to prevent unnecessary re-renders

  const totalAmount =
    instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) ||
    0

  const totalStudents =
    instructorData?.reduce(
      (acc, curr) => acc + curr.totalStudentsEnrolled,
      0
    ) || 0

  return (
    <div className="p-4 sm:p-6">
      {/* Welcome Section */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-richblack-5">
          Welcome Back, {user?.firstName}! 👋
        </h1>
        <p className="text-lg font-medium text-richblack-200">
          Ready to elevate your teaching?
        </p>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <div>
          {/* Chart & Stats Section */}
          <div className="my-6 flex flex-col gap-6 md:flex-row">
            {/* Chart Card */}
            <div className="w-full rounded-lg bg-richblack-800 p-6 shadow-lg md:w-2/3">
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize 📊
                  </p>
                </div>
              )}
            </div>

            {/* Statistics Card */}
            <div className="w-full rounded-lg bg-richblack-800 p-6 shadow-lg md:w-1/3">
              <p className="mb-4 text-xl font-semibold text-richblack-5">
                📈 Your Stats
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-bold text-yellow-300">
                    {courses.length}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-green-300 text-3xl font-bold">
                    {totalStudents}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg text-richblack-200">Total Earnings</p>
                  <p className="text-3xl font-bold text-blue-300">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="rounded-lg bg-richblack-800 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xl font-bold text-richblack-5">
                📚 Your Courses
              </p>
              <Link
                to="/dashboard/my-courses"
                className="text-yellow-400 transition hover:text-yellow-300"
              >
                View All →
              </Link>
            </div>

            {/* Responsive Course Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="transform overflow-hidden rounded-lg bg-richblack-700 shadow-md transition duration-300 hover:scale-105"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[180px] w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="truncate text-lg font-semibold text-richblack-50">
                      {course.courseName}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-sm text-richblack-300">
                      <span>{course.studentsEnrolled.length} Students</span>
                      <span>₹{course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-lg bg-richblack-800 p-6 py-20 text-center shadow-lg">
          <p className="text-2xl font-bold text-richblack-5">
            You haven’t created any courses yet 🚀
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-2 text-lg font-semibold text-yellow-400 transition hover:text-yellow-300"
          >
            Create a Course
          </Link>
        </div>
      )}
    </div>
  )
}
