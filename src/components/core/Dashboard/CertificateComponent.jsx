import React, { useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { QRCodeCanvas } from "qrcode.react"
import { useSelector } from "react-redux"

// For QR codes
import Logo from "../../../assets/Logo/Logo-Small-Dark.png"
// 🔥 Make sure you add these signature & stamp images into your assets
import Signature from "../../../assets/Logo/signaturemaker.net.png"
import Stamp from "../../../assets/Logo/vecteezy_approved-stamp-mark-clipart_8490043.png"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

const CertificateComponent = ({ courseId }) => {
  const certRef = useRef()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)

  const [courseTitle, setCourseTitle] = useState("")

  const today = new Date().toLocaleDateString()
  const fullName = `${user?.firstName} ${user?.lastName}`

  useEffect(() => {
    const fetchCourseTitle = async () => {
      try {
        const enrolledCourses = await getUserEnrolledCourses(token)
        const course = enrolledCourses.find((c) => c._id === courseId)
        if (course) setCourseTitle(course.courseName)
      } catch (err) {
        console.error("Error fetching course for certificate:", err)
      }
    }

    fetchCourseTitle()
  }, [courseId, token])

  const handleDownload = async () => {
    const element = certRef.current
    const canvas = await html2canvas(element, { scale: 2 }) // higher resolution
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height])
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
    pdf.save(`certificate-${courseTitle}.pdf`)
  }

  return (
    <div className="mt-6 text-center">
      {/* Certificate Preview */}
      <div
        ref={certRef}
        className="relative mx-auto max-w-4xl rounded-2xl border-[6px] border-yellow-400 bg-white px-12 py-16 text-black shadow-2xl"
      >
        {/* Top Header */}
        <div className="mb-6 flex flex-row items-center justify-center gap-2 border-b-2 border-yellow-400 pb-4">
          <img src={Logo} alt="Logo" width={50} height={50} />
          <h1 className="text-3xl font-bold text-blue-800">StudyHub</h1>
        </div>

        {/* Certificate Title */}
        <h1 className="mb-6 text-center text-4xl font-extrabold text-blue-800">
          Certificate of Completion
        </h1>

        {/* Certificate Text */}
        <p className="mb-4 text-center text-lg">
          This certificate is proudly presented to
        </p>
        <h2 className="mb-6 text-center text-3xl font-bold">{fullName}</h2>
        <p className="mb-4 text-center text-lg">
          For successfully completing the course
          <br />
          <strong className="text-2xl">{courseTitle || "Loading..."}</strong>
        </p>

        <p className="text-gray-600 mt-2 mb-6 text-center text-sm">
          Issued on: {today}
        </p>

        {/* Signature and Stamp */}
        <div className="mt-10 flex justify-between">
          <div className="flex flex-col items-center">
            <img src={Signature} alt="Signature" className="h-16" />
            <p className="font-semibold">Director, StudyHub</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={Stamp} alt="Stamp" className="h-20 opacity-80" />
            <p className="font-semibold">Official Seal</p>
          </div>
        </div>

        {/* QR Code at bottom center */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform flex-col items-center">
          <QRCodeCanvas
            value={`https://yourwebsite.com/certificate/verify/${courseId}`}
            size={60}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
          <p className="text-gray-500 mt-1 text-xs">Scan to Verify</p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-4 rounded bg-yellow-400 px-5 py-2 font-medium text-black hover:bg-yellow-300"
      >
        Download Certificate
      </button>
    </div>
  )
}

export default CertificateComponent
