const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // 🔥 CHANGE THIS (NOT 465)
  secure: false,          // MUST be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.verify();
    console.log("✅ Email server connected");

    await transporter.sendMail({
      from: `"LifeLink" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email SENT to:", to);
  } catch (err) {
    console.error("❌ Email FAILED:", err.message);
  }
};

module.exports = sendEmail;