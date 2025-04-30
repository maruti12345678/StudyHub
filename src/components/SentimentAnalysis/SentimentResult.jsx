import React from "react"

const SentimentResult = ({ analysis }) => {
  console.log("🟢 SentimentResult received analysis:", analysis)

  if (!analysis || analysis.length === 0) {
    console.log("⚠️ No analysis data available.")
    return <p>No sentiment analysis results available.</p>
  }

  return (
    <div>
      <h3>Analysis Results</h3>
      <ul>
        {analysis.map((result, index) => (
          <li key={index}>
            <strong>Review:</strong> {result.review} <br />
            <strong>Sentiment Score:</strong> {result.score} <br />
            <strong>Comparative Score:</strong> {result.comparative}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SentimentResult
