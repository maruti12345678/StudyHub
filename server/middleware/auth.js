// Importing required modules
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const User = require("../models/User")

// Configuring dotenv to load environment variables from .env file
dotenv.config()

// Authentication Middleware
exports.auth = async (req, res, next) => {
  try {
    // Extracting JWT from request sources
    const token =
      req.cookies.token ||
      req.body.token ||
      (req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization").replace("Bearer ", "")
        : null)

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token is Missing" })
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Ensure the token contains valid user information
      if (!decoded || !decoded.id) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Token Data" })
      }

      // Storing the decoded JWT payload in the request object for further use
      req.user = decoded
      next()
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is Invalid" })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong While Validating the Token",
    })
  }
}

// Role-Based Access Control Middleware
const checkRole = (role) => async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id)
    if (!userDetails || userDetails.accountType !== role) {
      return res
        .status(403)
        .json({ success: false, message: `Access Denied: ${role} Only` })
    }
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User Role Verification Failed" })
  }
}

// Role Check Middleware Exports
exports.isStudent = checkRole("Student")
exports.isAdmin = checkRole("Admin")
exports.isInstructor = checkRole("Instructor")
