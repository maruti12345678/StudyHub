import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  const generateRandomColors = (numColors) => {
    return Array.from(
      { length: numColors },
      () =>
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`
    )
  }

  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-4 sm:p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>

      {/* Buttons container */}
      <div className="flex flex-col gap-2 font-semibold sm:flex-row sm:gap-4">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-2 text-sm transition-all duration-200 sm:text-base ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-2 text-sm transition-all duration-200 sm:text-base ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      {/* Smaller Chart Container */}
      <div className="relative mx-auto aspect-square w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px]">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}
