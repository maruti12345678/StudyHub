// models/Purchase.js
const mongoose = require("mongoose")

const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseName: { type: String, required: true },
  },
  amount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
})

module.exports = mongoose.model("Purchase", PurchaseSchema)
