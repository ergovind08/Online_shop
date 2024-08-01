require("dotenv").config();
const nodeMailer = require("nodemailer");

const sendEmail = async (option) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: option.email,
      subject: option.subject,
      text: option.message,
      html: option.html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
