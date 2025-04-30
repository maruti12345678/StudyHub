// controllers/recommendController.js
const Course = require("../models/Course")

exports.getCategoryRecommendations = async (req, res) => {
  try {
    const { categoryId } = req.params
    const recommendedCourses = await Course.find({ category: categoryId })
      .limit(10)
      .populate("instructor") // or any other fields you want
    res.status(200).json({
      success: true,
      recommendedCourses,
    })
  } catch (error) {
    console.error("Error in category recommendation:", error)
    res.status(500).json({
      success: false,
      message: "Could not fetch category-based recommendations",
    })
  }
}
