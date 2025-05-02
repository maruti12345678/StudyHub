// services/operations/certificateAPI.js
import axios from "axios"

// or wherever your base-URL axios instance lives

// Fetch all certificates for the user
export const fetchAllCertificates = async (token) => {
  const res = await axios.get("http://localhost:4000/api/v1/certificate/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data.certificates
}

// Check a single certificate
export const checkCertificateAPI = (token, courseId) =>
  axios.get(`/certificate/check/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
