// controllers/certificateController.js
const Certificate = require("../models/Certificate")

// @desc   Check if certificate exists for a course
// @route  GET /api/v1/certificate/check/:courseId
// @access Private
exports.checkCertificate = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params

    const certificate = await Certificate.findOne({
      user: userId,
      course: courseId,
    })

    if (certificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate found",
        data: certificate,
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "Certificate not found. Pass the quiz first.",
      })
    }
  } catch (error) {
    console.error("Error checking certificate:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while checking certificate.",
    })
  }
}

// @desc   Return all certificates for the logged-in user
// @route  GET /api/v1/certificate/all
// @access Private
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id }).populate(
      "course"
    )
    res.status(200).json({ success: true, certificates })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch certificates" })
  }
}
