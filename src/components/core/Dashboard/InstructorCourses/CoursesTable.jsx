import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../Common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table className="rounded-xl border border-richblack-800">
          <Thead>
            <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
              <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                Courses
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Duration
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Price
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {courses?.length === 0 ? (
              <Tr>
                <Td
                  colSpan="4"
                  className="py-10 text-center text-lg font-medium text-richblack-100"
                >
                  No courses found
                </Td>
              </Tr>
            ) : (
              courses?.map((course) => (
                <Tr
                  key={course._id}
                  className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
                >
                  <Td className="flex flex-1 gap-x-4">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[148px] w-[220px] rounded-lg object-cover"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="text-lg font-semibold text-richblack-5">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-richblack-300">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                      <p className="text-[12px] text-white">
                        Created: {formatDate(course.createdAt)}
                      </p>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                          <HiClock size={14} />
                          Drafted
                        </p>
                      ) : (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                          <FaCheck
                            size={8}
                            className="rounded-full bg-yellow-100 p-1 text-richblack-700"
                          />
                          Published
                        </p>
                      )}
                    </div>
                  </Td>
                  <Td className="flex items-center gap-x-6 text-sm font-medium text-richblack-100">
                    <span>2hr 30min</span>
                    <span>₹{course.price}</span>
                    {/* Actions Icons in Same Line */}
                    <button
                      disabled={loading}
                      onClick={() =>
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }
                      title="Edit"
                      className="hover:text-gray-300 transform text-white transition hover:scale-110"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All data related to this course will be deleted.",
                          btn1Text: !loading ? "Delete" : "Loading...",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      title="Delete"
                      className="hover:text-gray-300 transform text-white transition hover:scale-110"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>

      {/* Mobile View (Unchanged) */}
      <div className="md:hidden">
        {courses?.map((course) => (
          <div
            key={course._id}
            className="mb-4 rounded-xl border border-richblack-800 bg-richblack-900 p-4"
          >
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="mb-3 h-[150px] w-full rounded-lg object-cover"
            />
            <p className="text-lg font-semibold text-white">
              {course.courseName}
            </p>
            <p className="text-xs text-richblack-300">
              {course.courseDescription.length > TRUNCATE_LENGTH
                ? course.courseDescription.slice(0, TRUNCATE_LENGTH) + "..."
                : course.courseDescription}
            </p>
            <p className="mt-2 text-sm text-richblack-100">
              ₹{course.price} | 2hr 30min
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-richblack-800 pt-3">
              <button
                className="text-white"
                onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
              >
                <FiEdit2 size={20} />
              </button>
              <button
                className="text-white"
                onClick={() =>
                  setConfirmationModal({
                    text1: "Do you want to delete this course?",
                    text2: "All related data will be deleted.",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleCourseDelete(course._id),
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
              >
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
