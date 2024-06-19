const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL, // Your email
    pass: `${process.env.EMAIL_PASSWORD}`, // Your email password
  },
});

exports.sendEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body.formData;
    const mailOptions = {
      from: email,
      to: process.env.EMAIL, // Admin email
      subject: "Arcade client email",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Bad request: Fields missing" });
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).send("Error sending email");
  }
};
