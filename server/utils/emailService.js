// /utils/emailService.js
const nodemailer = require("nodemailer")

const sendCertificateEmail = (
  userEmail,
  certificateUrl,
  courseName,
  certificatePath
) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: `Certificate of Completion for ${courseName}`,
    html: `
      <p>Dear ${userEmail},</p>
      <p>Congratulations! You have successfully completed the course <strong>${courseName}</strong>.</p>
      <p>Your certificate is ready, and you can download it from the link below:</p>
      <p><a href="${certificateUrl}">Download Certificate</a></p>
      <p>Best regards,</p>
      <p>The Course Team</p>
    `,
    attachments: [
      {
        filename: "certificate.pdf",
        path: certificatePath, // Attach the generated PDF file
      },
    ],
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}

module.exports = sendCertificateEmail
