import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../Common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    if (!courseSectionData.length) return
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId)
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]
        ?._id
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
    setVideoBarActive(activeSubSectionId)
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <>
      {/* Toggle button for mobile */}
      <div
        className="fixed top-3 left-3 z-50 cursor-pointer rounded-full bg-richblack-700 p-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-richblack-600 lg:hidden"
        onClick={() => setSidebarOpen((prev) => !prev)}
        title="Toggle Sidebar"
      >
        <BsChevronDown
          size={24}
          className={`transform ${
            sidebarOpen ? "rotate-180" : "rotate-0"
          } text-white transition-all duration-300`}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-[80%] max-w-[300px] flex-col rounded-r-lg bg-richblack-800 p-4 shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:w-[320px] lg:max-w-none lg:translate-x-0 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } text-white lg:block`}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between text-white lg:hidden">
          <p className="text-xl font-semibold text-white">Course Content</p>
          <button
            className="bg-red-600 hover:bg-red-500 rounded-lg px-2 py-1 text-white"
            onClick={() => setSidebarOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-lg font-semibold text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="bg-gray-100 text-gray-800 flex items-center gap-2 rounded-full px-3 py-2 text-white transition-transform hover:scale-95"
            >
              <IoIosArrowBack size={24} /> Back
            </button>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto text-white bg-yellow-500 hover:bg-yellow-400"
              onclick={() => setReviewModal(true)}
            />
          </div>

          <p className="text-lg font-semibold text-white">
            {courseEntireData?.courseName}
          </p>
          <p className="text-sm font-medium text-white">
            {completedLectures?.length} / {totalNoOfLectures} Completed
          </p>
        </div>

        <div className="custom-scrollbar mt-4 h-[calc(100vh-6rem)] overflow-y-auto text-white">
          {courseSectionData.map((course, index) => (
            <div key={index}>
              <div
                className="bg-gray-700 hover:bg-gray-600 flex justify-between rounded-lg px-4 py-3 text-white transition-colors"
                onClick={() =>
                  setActiveStatus(
                    activeStatus === course?._id ? "" : course?._id
                  )
                }
              >
                <span className="font-semibold text-white">
                  {course?.sectionName}
                </span>
                <BsChevronDown
                  className={`transition-transform ${
                    activeStatus === course?._id ? "rotate-180" : "rotate-0"
                  } text-white`}
                />
              </div>
              {activeStatus === course?._id && (
                <div className="border-gray-500 mt-2 border-l pl-4 text-white">
                  {course.subSection.map((topic, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-white transition-colors ${
                        videoBarActive === topic._id
                          ? "bg-yellow-300 text-black"
                          : "hover:bg-gray-900"
                      }`}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        )
                        setVideoBarActive(topic._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        readOnly
                        className="text-white accent-yellow-500"
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
