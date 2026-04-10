TalentFlow Learning Platform (Backend)
TalentFlow is a robust, scalable Learning Management System (LMS) backend built with the MERN stack (Node.js/Express focus) and PostgreSQL. It is designed to empower instructors and students through automated assignment management, progress tracking, and secure authentication.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL (with Sequelize/Raw Queries)

Caching & OTP: Redis

Authentication: JWT (JSON Web Tokens) with 3-step Password Reset

Documentation: Swagger UI

Deployment: Railway / Render

✨ Key Features
🔐 Advanced Authentication
OTP-Only Verification: Optimized "Forgot Password" flow using Redis for high-speed OTP validation.

Secure Reset: Short-lived JWT resetToken strategy to ensure password changes are authorized and secure.

Role-Based Access (RBAC): Middleware-driven permissions for Student, Instructor, and Admin.

📚 Course & Lesson Management
Full CRUD operations for Courses and Lessons.

Video and document resource integration support.

Progress Tracking: Real-time tracking of student completion rates across lessons.

📝 Assignment & Grading System
Automated assignment distribution to enrolled students.

Dynamic updates using COALESCE to allow partial data modifications without data loss.

Instructor dashboard for reviewing and grading submissions.

🔔 Notification System
In-app notifications for assignment deadlines, course updates, and system alerts.

Email integration for critical account actions (registration, password resets).

🚦 Getting Started
Prerequisites
Node.js (v18+)

PostgreSQL

Redis

Installation
Clone the repository:

Bash
git clone https://github.com/YourUsername/TalentFlow-Learning-Platform.git
cd TalentFlow-Learning-Platform
Install dependencies:

Bash
npm install
Environment Setup:
Create a .env file in the root and add:

Code snippet
PORT=5000
DATABASE_URL=your_postgresql_url
REDIS_URL=your_redis_url
JWT_SECRET=your_secret_key
MAILER_USER=your_email
MAILER_PASS=your_app_password
Run Migrations:

Bash
npm run migrate
Start the Server:

Bash
npm run dev
📖 API Documentation
Once the server is running, you can access the interactive Swagger UI at:
http://localhost:5000/api-docs

🤝 Contributors
Emmanuel Edache Adikwu – Lead Backend Engineer (Auth, Logic, & Deployment)

Toria (VikkyRia) – Project Coordination & Core Logic

Temyl – Assignments & Certificates Module
