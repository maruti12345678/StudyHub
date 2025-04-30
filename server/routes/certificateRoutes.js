// routes/certificateRoutes.js
const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const {
  checkCertificate,
  getAllCertificates,
} = require("../controllers/certificateController")

// Check one certificate
router.get("/check/:courseId", auth, checkCertificate)

// Get all certificates
router.get("/all", auth, getAllCertificates)

module.exports = router
