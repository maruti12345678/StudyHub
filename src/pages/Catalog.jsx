import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

// Components
import Footer from "../components/Common/Footer"
import Course_Slider from "../components/core/Catalog/Course_Slider"
import { apiConnector } from "../services/apiConnector"
import { categories, endpoints } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
import Error from "./Error"

// ✅ Function to compute tag-based similarity
const calculateTagSimilarity = (tags1, tags2) => {
  if (!tags1 || !tags2) return 0
  const set1 = new Set(tags1.map((tag) => tag.toLowerCase()))
  const set2 = new Set(tags2.map((tag) => tag.toLowerCase()))
  const intersection = new Set([...set1].filter((tag) => set2.has(tag)))
  return intersection.size / Math.max(set1.size, set2.size)
}

function Catalog() {
  // ✅ Fetch `user` from `profileSlice.js`
  const user = useSelector((state) => state.profile?.user || null)
  console.log("🟢 User from Redux (Profile Slice):", user)

  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [courses, setCourses] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const normalizeCategory = (category) => {
    if (!category) return ""

    return category.toLowerCase().replace(/\s+/g, "-") // Convert spaces to hyphens
  }
  const [categoryCourses, setCategoryCourses] = useState([])
  const [verifiedCourses, setVerifiedCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [collabRecommendedCourses, setCollabRecommendedCourses] = useState([])
  // Fetch categoryId based on catalogName
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category_id = res?.data?.data?.find(
          (ct) =>
            typeof ct.name === "string" &&
            ct.name.split(" ").join("-").toLowerCase() === catalogName
        )?._id
        console.log("📦 Categories from API:", res?.data?.data)

        setCategoryId(category_id)
      } catch (error) {
        console.error("❌ Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        if (!categoryId) return
        const res = await apiConnector(
          "GET",
          `${endpoints.COLLABORATIVE_RECOMMENDATION}/${categoryId}`
        )
        console.log("📡 Category Recommendations:", res?.data)

        if (res?.data?.success) {
          setCollabRecommendedCourses(res.data.recommendedCourses || [])
        }
      } catch (error) {
        console.error("❌ Error fetching category recommendations:", error)
      }
    }

    fetchRecommendedCourses()
  }, [categoryId])

  // ✅ Fetch verified courses
  useEffect(() => {
    axios
      .get("https://study-hub-new.vercel.app/api/v1/course/verified-courses")
      .then((response) => {
        console.log("🟢 Verified Courses API Response:", response.data)
        setVerifiedCourses(response.data)
      })
      .catch((error) => {
        console.error(
          "❌ Error fetching verified courses:",
          error.response?.data || error.message
        )
      })
  }, [])

  useEffect(() => {
    console.log("🟢 API Response (Courses):", courses)

    if (courses.length > 0) {
      console.log(
        "🟢 Courses with Tags:",
        courses.map((course) => ({
          courseName: course.courseName,
          tags: course.tag || "No Tags Found",
        }))
      )
    }
  }, [courses])

  // ✅ Fetch Catalog Page Data
  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])

  // ✅ Fetch All Courses
  useEffect(() => {
    console.log("🟢 Fetching Courses from API...")
    axios
      .get("https://study-hub-new.vercel.app/api/v1/course/courses")
      .then((response) => {
        console.log("🟢 API Response (Courses):", response.data)
        setCourses(response.data)
      })
      .catch((error) => console.error("❌ Error fetching courses:", error))
  }, [])

  useEffect(() => {
    console.log("🔄 Running Tags-Based Recommendation useEffect...")
    console.log("🟡 Courses Array:", courses)

    if (!user || courses.length === 0) return

    // ✅ Find last enrolled course (if any)
    const lastEnrolledCourseId = user.enrolledCourses?.slice(-1)[0]
    if (!lastEnrolledCourseId) {
      console.log("❌ No enrolled courses found.")
      return
    }

    const lastEnrolledCourse = courses.find(
      (course) => course._id === lastEnrolledCourseId
    )
    if (!lastEnrolledCourse) {
      console.log("❌ Last enrolled course not found in fetched courses.")
      return
    }

    console.log("🟢 Last Enrolled Course:", lastEnrolledCourse)

    // ✅ Compute similarity and filter courses based on tags
    const recommendations = courses
      .filter((course) => course._id !== lastEnrolledCourseId) // Exclude already enrolled course
      .map((course) => ({
        ...course,
        similarity: calculateTagSimilarity(
          lastEnrolledCourse.tag || [],
          course.tag || []
        ),
      }))
      .filter((course) => course.similarity > 0) // Ensure similarity is meaningful
      .sort((a, b) => b.similarity - a.similarity) // Sort by highest similarity
      .slice(0, 5) // Select top 5 recommended courses

    console.log("🟢 Recommended Courses:", recommendations)
    setRecommendedCourses(recommendations)
  }, [user, courses])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  if (loadingCourses) {
    return <div className="p-4 text-center text-white">Loading courses...</div>
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 - Courses to Get Started */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <Course_Slider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>

      {/* Section 2 - Top Rated Courses */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Top Rated Courses</div>
        <div className="py-8">
          <Course_Slider
            Courses={catalogPageData?.data?.differentCategory?.courses.map(
              (course) => ({
                ...course,
                rating: course.avgRating || 0,
              })
            )}
          />
        </div>
      </div>

      {/* Section 3 - Most Selling Courses */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Most Selling Courses</div>
        <div className="py-8">
          <Course_Slider Courses={catalogPageData?.data?.mostSellingCourses} />
        </div>
      </div>

      {/* ✅ Section 4 - Recommended Courses (Same Category) */}
      {/* {collabRecommendedCourses?.length > 0 && (
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">
            Recommended Courses from Same Category
          </div>
          <div className="py-8">
            <Course_Slider
              Courses={collabRecommendedCourses.map((course) => ({
                ...course,
                rating: course.avgRating || 0,
                courseName: course.courseName || "Untitled",
                thumbnail: course.thumbnail || "/default-thumbnail.jpg",
              }))}
            />
          </div>
        </div>
      )} */}

      <Footer />
    </>
  )
}

export default Catalog
