const express = require("express")
const { exec } = require("child_process")

const router = express.Router()

router.get("/recommend/:userId", (req, res) => {
  const userId = req.params.userId

  exec(`python recommendation.py ${userId}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error generating recommendations",
        error,
      })
    }
    try {
      const recommendations = JSON.parse(stdout)
      res.status(200).json({ success: true, recommended: recommendations })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error parsing recommendations",
        error: err,
      })
    }
  })
})

module.exports = router
