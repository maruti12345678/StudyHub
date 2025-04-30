import { useSelector } from "react-redux"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.course)

  if (paymentLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )

  return (
    <>
      <h1 className="mb-6 text-2xl font-medium text-richblack-5 sm:text-3xl">
        Cart
      </h1>
      <p className="border-b border-b-richblack-400 pb-2 text-sm font-semibold text-richblack-400 sm:text-base">
        {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Cart
      </p>
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-y-6 lg:flex-row lg:gap-x-10">
          {/* Course List */}
          <div className="w-full lg:w-2/3">
            <RenderCartCourses />
          </div>
          {/* Total Amount */}
          <div className="w-full lg:w-1/3">
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <p className="mt-14 text-center text-xl font-medium text-richblack-100 sm:text-2xl">
          Your cart is empty
        </p>
      )}
    </>
  )
}
