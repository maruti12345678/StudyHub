import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Autoplay, FreeMode, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

import Img from "./Img"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import { FaStar } from "react-icons/fa"

import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          setReviews(data?.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      }
    }

    fetchReviews()
  }, [])

  return (
    <div className="px-4 text-white md:px-8">
      <div className="my-8 mx-auto max-w-screen-lg sm:mx-2">
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1 }, // Extra small screens
            480: { slidesPerView: 1.2 }, // Small screens
            640: { slidesPerView: 1.5 }, // Slightly larger small screens
            768: { slidesPerView: 2 }, // Medium screens
            1024: { slidesPerView: 4 }, // Large screens
          }}
          spaceBetween={20}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="swiper-slide-margin">
              <div
                className="flex flex-col gap-4 rounded-lg bg-richblack-800 p-4 text-[14px] shadow-lg md:text-[16px]"
                style={{
                  height: "300px", // Fixed height
                  width: "250px", // Fixed width
                }}
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Img
                    src={
                      review?.user?.image ||
                      `https://api.dicebear.com/5.x/initials/svg?seed=${
                        review?.user?.firstName || "User"
                      } ${review?.user?.lastName || ""}`
                    }
                    alt={`${review?.user?.firstName || "User"} ${
                      review?.user?.lastName || ""
                    }`}
                    className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-sm font-semibold capitalize text-richblack-5 md:text-base">
                      {`${review?.user?.firstName || "Anonymous"} ${
                        review?.user?.lastName || ""
                      }`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500 md:text-[14px]">
                      {review?.course?.courseName || "General Course"}
                    </h2>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm font-medium leading-snug text-richblack-25 md:text-base">
                  {review?.review &&
                  review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : review?.review || "No review provided."}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-yellow-100 md:text-base">
                    {review?.rating || 0}
                  </h3>
                  <ReactStars
                    count={5}
                    value={Number(review?.rating) || 0}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
