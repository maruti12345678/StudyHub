import React, { useEffect, useState } from "react"
import axios from "axios"

const Reviews = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    axios
      .get("https://study-hub-f2fi.vercel.app/api/reviews")
      .then((response) => setReviews(response.data))
      .catch((error) => console.error("Error fetching reviews:", error))
  }, [])

  return (
    <div>
      <h2>Course Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <strong>Review:</strong> {review.text} <br />
              <strong>Sentiment:</strong> {review.sentiment}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  )
}

export default Reviews
