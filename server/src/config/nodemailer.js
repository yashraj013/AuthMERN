import nodemailer from "nodemailer"

console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASSWORD exists?", !!process.env.SMTP_PASSWORD);

// add SMTP details from brevo
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;