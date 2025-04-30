// Importing necessary modules and packages
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")

// Importing Routes
const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payments")
const recommendRoutes = require("./routes/recommend")
const contactUsRoute = require("./routes/Contact")
const quizRoutes = require("./routes/quizRoutes")
const certificateRoutes = require("./routes/certificateRoutes")

// Importing Configs
const database = require("./config/database")
const { cloudinaryConnect } = require("./config/cloudinary")

// Setting up port number
const PORT = process.env.PORT || 4000

// Loading environment variables from .env file
dotenv.config()

// Connecting to database
database.connect()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this for production
    credentials: true,
  })
)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

// Connecting to Cloudinary
cloudinaryConnect()

// Setting up routes
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes) // ✅ Corrected & Updated Course Routes
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/recommend", recommendRoutes)
app.use("/api/v1/reach", contactUsRoute)
app.use("/api/v1/quiz", quizRoutes)
app.use("/api/v1/certificate", certificateRoutes)
app.use("/api/v1/certificate", require("./routes/certificateRoutes"))
app.use("/api/v1/profile", require("./routes/profile"))

// Load review routes
app.use("/api/reviews", require("./routes/reviewRoutes"))

// Testing the server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  })
})

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`)
})
