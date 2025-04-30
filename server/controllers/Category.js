const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const categoryDetails = await Category.create({ name, description })

    console.log(categoryDetails)
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find()
    res.status(200).json({ success: true, data: allCategories })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the selected category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }

    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses from other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "ratingAndReviews" },
      })
      .exec()

    // Flatten all courses into a single array
    let topRatedCourses = categoriesExceptSelected.flatMap(
      (category) => category.courses
    )

    // Calculate average ratings and exclude courses with no ratings
    topRatedCourses = topRatedCourses
      .map((course) => {
        const ratings = course.ratingAndReviews?.map((r) => r.rating) || []
        const avgRating = ratings.length
          ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
          : 0

        return { ...course.toObject(), avgRating, totalRatings: ratings.length }
      })
      .filter((course) => course.totalRatings > 0) // Exclude courses with no ratings
      .sort((a, b) => b.avgRating - a.avgRating) // Sort courses by rating

    // Get Most Selling Courses (based on students enrolled)
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "ratingAndReviews" },
      })
      .exec()

    const allCourses = allCategories.flatMap((category) => category.courses)

    // Debugging: Log all courses before filtering
    console.log(
      "All Courses Before Filtering:",
      allCourses.map((course) => ({
        courseName: course.courseName,
        enrolledStudents: course.studentsEnrolled
          ? course.studentsEnrolled.length
          : 0,
      }))
    )

    const categoryCount = new Map()
    const CATEGORY_LIMIT = 3 // Max courses per category

    const mostSellingCourses = allCourses
      .map((course) => {
        const ratings = course.ratingAndReviews?.map((r) => r.rating) || []
        const avgRating = ratings.length
          ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
          : 0

        const enrolledStudents = Array.isArray(course.studentsEnrolled)
          ? course.studentsEnrolled.length
          : 0

        return { ...course.toObject(), avgRating, enrolledStudents }
      })
      .filter((course) => course.enrolledStudents > 0) // Exclude courses with no enrolled students
      .sort((a, b) => b.enrolledStudents - a.enrolledStudents) // Sort by most enrolled students
      .filter((course) => {
        const categoryId = course.category.toString()
        if (!categoryCount.has(categoryId)) {
          categoryCount.set(categoryId, 1)
          return true
        } else if (categoryCount.get(categoryId) < CATEGORY_LIMIT) {
          categoryCount.set(categoryId, categoryCount.get(categoryId) + 1)
          return true
        }
        return false
      })

    // Debugging: Log filtered most selling courses
    console.log(
      "Filtered Most Selling Courses:",
      mostSellingCourses.map((course) => ({
        courseName: course.courseName,
        enrolledStudents: course.enrolledStudents,
      }))
    )

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory: { courses: topRatedCourses }, // Top-rated courses
        mostSellingCourses, // Sorted most-selling courses
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
