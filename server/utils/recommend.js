const Course = require("../models/Course")
const User = require("../models/User")

exports.getRecommendedCourses = async (userId) => {
  try {
    console.log("📥 Fetching user:", userId)

    const user = await User.findById(userId).populate("enrolledCourses")
    console.log("👤 User found:", user)

    if (!user || user.enrolledCourses.length === 0) {
      console.log("⚠️ No enrolled courses found for user.")
      return []
    }

    const tags = user.enrolledCourses.flatMap((course) => course.tag || [])
    console.log("🏷️ Tags from enrolled courses:", tags)

    const recommendedCourses = await Course.find({
      tag: { $in: tags },
      _id: { $nin: user.enrolledCourses.map((c) => c._id) },
    }).limit(10)

    console.log("🎯 Final Recommendations:", recommendedCourses)
    return recommendedCourses
  } catch (error) {
    console.error("❌ Error in getRecommendedCourses:", error)
    throw error
  }
}
