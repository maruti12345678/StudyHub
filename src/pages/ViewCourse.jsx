import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)

  // Fetch course details
  const fetchCourseDetails = async () => {
    if (!courseId || !token) return // Prevent unnecessary API calls

    try {
      const courseData = await getFullDetailsOfCourse(courseId, token)

      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))

      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })

      dispatch(setTotalNoOfLectures(lectures))
    } catch (error) {
      console.error("Failed to fetch course details:", error)
    }
  }

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId, token, dispatch]) // Added dependencies

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
        {/* Sidebar */}
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        {/* Main Content */}
        <div className="h-full flex-1 overflow-auto px-4 py-2">
          <Outlet />
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
