// CertificatePage.js
import React from "react"
import { useParams } from "react-router-dom"

import CertificateComponent from "../components/core/Dashboard/CertificateComponent"

const CertificatePage = () => {
  const { courseId } = useParams()

  return (
    <div className="min-h-[80vh] p-6 text-white">
      <h2 className="mb-4 text-2xl font-bold">Course Certificate</h2>
      <CertificateComponent courseId={courseId} />
    </div>
  )
}

export default CertificatePage
