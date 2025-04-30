import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!courseSectionData.length || !courseId || !sectionId || !subSectionId) {
      navigate(`/dashboard/enrolled-courses`)
      return
    }

    const filteredSection = courseSectionData.find(
      (section) => section._id === sectionId
    )

    if (!filteredSection) return

    const filteredVideo = filteredSection.subSection.find(
      (sub) => sub._id === subSectionId
    )

    if (filteredVideo) {
      setVideoData(filteredVideo)
    } else {
      setVideoData(null)
    }

    setPreviewSource(courseEntireData.thumbnail || "")
    setVideoEnded(false)
  }, [
    courseSectionData,
    courseEntireData,
    navigate,
    courseId,
    sectionId,
    subSectionId,
  ])

  const handleLectureCompletion = async () => {
    if (!subSectionId || completedLectures.includes(subSectionId)) return

    setLoading(true)
    try {
      const res = await markLectureAsComplete(
        { courseId, subsectionId: subSectionId },
        token
      )
      if (res) dispatch(updateCompletedLectures(subSectionId))
    } catch (error) {
      console.error("Error marking lecture as complete:", error)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 px-4 text-white sm:px-6 md:px-10 lg:px-16">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="mx-auto h-full w-full max-w-[500px] rounded-md object-cover"
        />
      ) : (
        <div className="relative aspect-video w-full">
          <Player
            ref={playerRef}
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl || ""}
            className="h-auto w-full"
          >
            <BigPlayButton position="center" />
          </Player>

          {/* Overlay Buttons After Video Ends */}
          {videoEnded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-md transition-opacity duration-300">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={
                    loading ? "Marking as Completed..." : "Mark As Completed"
                  }
                  customClasses="text-lg sm:text-xl px-4 py-2"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    playerRef.current.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-lg sm:text-xl px-4 py-2"
              />
            </div>
          )}
        </div>
      )}

      <h1 className="mt-5 text-center text-lg font-semibold sm:text-2xl">
        {videoData?.title || "Untitled Lecture"}
      </h1>
      <p className="text-center text-sm sm:text-base">
        {videoData?.description || "No description available."}
      </p>
    </div>
  )
}

export default VideoDetails
