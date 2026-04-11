# TalentFlow Learning Platform - Backend

A robust, containerized RESTful API built for a multilingual learning management system. This backend handles secure authentication, instructor/learner role management, and real-time OTP verification.

## 🚀 Live Links
- **Production API:** [https://talentflow-backend-4dd1.onrender.com](https://talentflow-backend-4dd1.onrender.com)
- **Interactive API Documentation:** [https://talentflow-backend-4dd1.onrender.com/api-docs](https://talentflow-backend-4dd1.onrender.com/api-docs)

## 🛠️ Tech Stack & Infrastructure
- **Runtime:** Node.js / Express
- **Database:** PostgreSQL (Relational Data)
- **Caching/OTP:** Upstash Redis
- **Containerization:** Docker & Docker Hub
- **Deployment:** Render (Web Service)
- **Documentation:** Swagger UI (OpenAPI 3.0)
- **Security:** JWT, Bcrypt, and Role-Based Access Control (RBAC)

## 🐳 Docker Deployment
This project is fully containerized to ensure environment consistency. 
To run this project locally using Docker:
```bash
docker pull emmanuel8577/talentflow-backend:v11
docker run -p 5000:5000 --env-file .env emmanuel8577/talentflow-backend:v11
🔐 Security Features
Restricted Admin Creation: Admin accounts cannot be created via public endpoints. They are managed through an internal CLI seeding script to prevent privilege escalation.

OTP Verification: Registration is protected by a 6-digit OTP sent via email and validated against a Redis cache with a 10-minute expiry.

RBAC: Fine-grained access control for Learners, Instructors, and Admins.

🚦 Getting Started
Clone the repo: git clone https://github.com/Emmanuel8577/TalentFlow-Learning-Platform.git

Install dependencies: npm install

Set up your .env (Database URLs, Redis credentials, JWT secret).

Start development server: npm run dev


---

### ⬆️ How to Update and Push

Once you've saved the text above into your `README.md`, run these commands to update your GitHub profile:

```powershell
# 1. Add the change
git add README.md

# 2. Commit it
git commit -m "docs: update README with live URLs, Docker instructions, and security details"

# 3. Push to your account
git push origin main
