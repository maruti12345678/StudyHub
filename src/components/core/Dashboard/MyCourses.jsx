import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="mb-14 flex flex-col items-center justify-between sm:flex-row">
        <h1 className="mb-4 text-3xl font-medium text-richblack-5 sm:mb-0">
          My Courses
        </h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
          className="w-full text-sm sm:w-auto sm:text-base"
        >
          <VscAdd />
        </IconBtn>
      </div>
      {courses && (
        <CoursesTable
          courses={courses}
          setCourses={setCourses}
          className="overflow-x-auto"
        />
      )}
    </div>
  )
}
