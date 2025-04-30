// routes/recommend.js
const express = require("express")
const router = express.Router()

const {
  getCategoryRecommendations,
} = require("../controllers/recommendController")

router.get("/recommendations/category/:categoryId", getCategoryRecommendations)

module.exports = router
