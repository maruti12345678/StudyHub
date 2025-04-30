import { useEffect, useState } from "react"
import { FaSpinner } from "react-icons/fa"
import { useSelector } from "react-redux"

import { fetchPurchaseHistory } from "../services/operations/profileAPI"

export default function PurchaseHistory() {
  const { token } = useSelector((state) => state.auth)
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const purchasedCourses = await fetchPurchaseHistory(token)
        setPurchases(purchasedCourses)
      } catch (error) {
        console.error("Error fetching purchase history:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadHistory()
    }
  }, [token])

  return (
    <div className="min-h-screen px-6 py-8 text-white">
      <h2 className="mb-10 text-center text-3xl font-bold">
        🛒 Your Purchase History
      </h2>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-yellow-400" />
        </div>
      ) : purchases.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">
          You have not purchased any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {purchases.map((course) => (
            <div
              key={course._id}
              className="flex h-[420px] flex-col overflow-hidden rounded-lg bg-richblack-700 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50" // little reduced height
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-56 w-full object-cover"
              />

              <div className="flex flex-grow flex-col justify-between p-6">
                <div>
                  <h3 className="mb-4 break-words text-2xl font-semibold">
                    {course.courseName}
                  </h3>
                  <p className="text-gray-400 mb-2 text-sm">
                    Purchased on:{" "}
                    {new Date(course.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-lg font-bold text-yellow-400">
                    ₹{course.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
