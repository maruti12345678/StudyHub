import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./styles.css"
// import required modules
import { Navigation, Pagination } from "swiper"

// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
import Course_Card from "./Course_Card"

function Course_Slider({ Courses }) {
  console.log("Courses Passed to Slider:", Courses) // Debugging

  if (!Courses || Courses.length === 0) {
    return <p>No recommended courses available.</p>
  }
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            // Configure the number of slides per view for different screen sizes
            320: {
              slidesPerView: 1, // Show 1 slide at a time on very small screens
            },
            640: {
              slidesPerView: 1, // Show 1 slide at a time on small screens
            },
            768: {
              slidesPerView: 2, // Show 2 slides at a time on medium screens
            },
            1024: {
              slidesPerView: 3, // Show 3 slides at a time on larger screens
            },
          }}
          className="mySwiper max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
