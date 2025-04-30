// Icons Import
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaArrowRight } from "react-icons/fa"
import { MdOutlineRateReview } from "react-icons/md"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

// Image and Video Import
import Banner from "../assets/Images/banner.mp4"
// background random images
import backgroundImg1 from "../assets/Images/random bg img/coding bg1.jpg"
import backgroundImg2 from "../assets/Images/random bg img/coding bg2.jpg"
import backgroundImg3 from "../assets/Images/random bg img/coding bg3.jpg"
import backgroundImg4 from "../assets/Images/random bg img/coding bg4.jpg"
import backgroundImg5 from "../assets/Images/random bg img/coding bg5.jpg"
import backgroundImg6 from "../assets/Images/random bg img/coding bg6.jpeg"
import backgroundImg7 from "../assets/Images/random bg img/coding bg7.jpg"
import backgroundImg8 from "../assets/Images/random bg img/coding bg8.jpeg"
import backgroundImg9 from "../assets/Images/random bg img/coding bg9.jpg"
import backgroundImg10 from "../assets/Images/random bg img/coding bg10.jpg"
import backgroundImg11 from "../assets/Images/random bg img/coding bg11.jpg"

// Component Imports
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import CourseSlider from "../components/core/Catalog/Course_Slider"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/Timeline"

const randomImges = [
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  backgroundImg5,
  backgroundImg6,
  backgroundImg7,
  backgroundImg8,
  backgroundImg9,
  backgroundImg10,
  backgroundImg11,
]

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState(null)

  useEffect(() => {
    const bg = randomImges[Math.floor(Math.random() * randomImges.length)]
    setBackgroundImg(bg)
  }, [])

  return (
    <React.Fragment>
      {/* Stylish Background Section */}
      <div className="relative h-[450px] md:h-[650px]">
        <div className="absolute top-0 left-0 h-full w-full overflow-hidden opacity-50">
          <img
            src={backgroundImg}
            alt="Dynamic Background"
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold drop-shadow-lg md:text-5xl">
            Empower Your Future with
            <HighlightText text="Coding Skills" />
          </h1>
          <p className="mt-2 text-lg md:text-xl">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </p>
          <div className="mt-4 flex flex-row gap-7">
            <CTAButton active={true} linkto="/signup">
              Learn More
            </CTAButton>
            <CTAButton active={false} linkto="/login">
              Get Started
            </CTAButton>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Video Section */}
        {/* <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div> */}

        {/* Code Section 1 */}
        <CodeBlocks
          position="lg:flex-row"
          heading={
            <div className="text-4xl font-semibold">
              Unlock your <HighlightText text="coding potential" /> with our
              online courses.
            </div>
          }
          subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          ctabtn1={{
            btnText: "Try it Yourself",
            link: "/signup",
            active: true,
          }}
          ctabtn2={{ btnText: "Learn More", link: "/signup", active: false }}
          codeColor="text-yellow-25"
          codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
          backgroundGradient={<div className="codeblock1 absolute"></div>}
        />

        <CodeBlocks
          position="lg:flex-row-reverse"
          heading={
            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
              Start <HighlightText text="coding in seconds" />
            </div>
          }
          subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          ctabtn1={{
            btnText: "Continue Lesson",
            link: "/signup",
            active: true,
          }}
          ctabtn2={{ btnText: "Learn More", link: "/signup", active: false }}
          codeColor="text-white"
          codeblock={`import React from "react";\nimport CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\n  return (\n    <div>Home</div>\n  );\n};\nexport default Home;`}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
        />

        {/* Explore Section */}
        <ExploreMore />
      </div>

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto="/signup">
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto="/login">
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the skills you need for a{" "}
              <HighlightText text="job that is in demand." />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyHub dictates its own terms. Today, being a
                competitive specialist requires more than just professional
                skills.
              </div>
              <CTAButton active={true} linkto="/signup">
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />
        <h1 className="mt-8 text-center text-4xl font-semibold">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </React.Fragment>
  )
}

export default Home
