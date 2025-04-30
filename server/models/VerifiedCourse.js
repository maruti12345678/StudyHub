const mongoose = require("mongoose")

const VerifiedCourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  provider: { type: String, required: true }, // Example: SWAYAM, NPTEL, Coursera, etc.
  category: { type: String, required: true },
  description: { type: String, required: true },
  verified: { type: Boolean, default: true }, // Always true for verified courses
})

module.exports = mongoose.model("VerifiedCourse", VerifiedCourseSchema)
