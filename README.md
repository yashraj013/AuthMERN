Authentication System (Login & Password Reset via Email)
📌 Overview
This is a secure authentication system built with modern web technologies that allows users to:

Register with their email and password.

Log in securely using authentication tokens.

Reset password via email with OTP or link verification.

The system follows best security practices, including password hashing and token-based authentication.

🚀 Features
🔐 User Registration with encrypted password storage (bcrypt)

✅ User Login with JWT token authentication

📧 Password Reset via Email (OTP or link verification)

🛡 Secure API with input validation and error handling

📂 Modular Code Structure for scalability

🛠 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)
Authentication: JWT (JSON Web Token)
Security: bcrypt.js for password hashing, dotenv for environment variables
Email Service: Nodemailer (or any SMTP provider like Gmail, SendGrid)


