import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"

import { removeFromCart } from "../../../../slices/cartSlice"

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course, indx) => (
        <div
          key={course._id}
          className={`flex flex-wrap items-start justify-between gap-6 ${
            indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
          } ${indx !== 0 && "mt-6"} `}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 xl:flex-row">
            {/* Course Image */}
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[148px] w-full rounded-lg object-cover sm:w-[200px] lg:h-[160px] xl:w-[220px]"
            />
            {/* Course Details */}
            <div className="flex flex-1 flex-col space-y-2">
              <p className="text-base font-medium text-richblack-5 sm:text-lg">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-5">4.5</span>
                <ReactStars
                  count={5}
                  value={course?.ratingAndReviews?.length}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-xs text-richblack-400 sm:text-sm">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          {/* Price and Remove Button */}
          <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row sm:items-center xl:flex-col xl:items-end">
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-2 px-3 text-xs text-pink-200 sm:py-3 sm:px-[12px] sm:text-sm"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="text-lg font-medium text-yellow-100 sm:text-2xl lg:text-3xl">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
