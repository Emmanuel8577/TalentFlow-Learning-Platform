# TalentFlow LMS — API Endpoints Documentation

## Team Assignment

| Developer | Module | Branch |
|-----------|--------|--------|
| **Toria (Lead)** | Users + Courses + Enrollment + Lessons | `feature/users-courses` |
| **Emmanuel** | Auth + Notifications | `feature/auth-notifications` |
| **Temyl** | Assignments + Progress + Certificates | `feature/assignments-progress` |

> **Rule:** Never push directly to `main`. Always push to your branch and open a Pull Request.

---

## 📌 Standard Response Format

Every endpoint must return this format:

**Success:**
```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Description of what went wrong"
}
```

---

## 📌 Protected Routes

Routes marked with 🔒 require an Authorization header:

```
Authorization: Bearer <token>
```

Routes marked with 👑 are admin only.
Routes marked with 🎓 are instructor only.

---

## 🔐 Auth — Emmanuel

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT token | Public |
| POST | `/api/auth/logout` | Logout current user | 🔒 |
| POST | `/api/auth/forgot-password` | Send password reset email | Public |
| POST | `/api/auth/reset-password` | Reset password with token | Public |

### Request Bodies

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "learner"
}
```
> Role options: `learner`, `instructor`, `admin`

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**POST /api/auth/forgot-password**
```json
{
  "email": "john@example.com"
}
```

**POST /api/auth/reset-password**
```json
{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

---

## 🔔 Notifications — Emmanuel

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notifications` | Get my notifications | 🔒 |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | 🔒 |
| DELETE | `/api/notifications/:id` | Delete a notification | 🔒 |

---

## 👤 Users — Toria

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/profile` | Get my own profile | 🔒 |
| PATCH | `/api/users/profile` | Update my own profile | 🔒 |
| GET | `/api/users` | Get all users | 🔒 👑 |
| GET | `/api/users/:id` | Get single user by ID | 🔒 👑 |
| PATCH | `/api/users/:id/role` | Assign role to user | 🔒 👑 |
| GET | `/api/users/:id/progress` | Get user learning history | 🔒 |

### Request Bodies

**PATCH /api/users/profile**
```json
{
  "name": "John Doe",
  "avatar": "https://link-to-avatar.com/image.png"
}
```

**PATCH /api/users/:id/role**
```json
{
  "role": "instructor"
}
```
> Role options: `learner`, `instructor`, `admin`

---

## 📚 Courses — Toria

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses` | Browse all published courses | Public |
| GET | `/api/courses/:id` | Get single course details | Public |
| POST | `/api/courses` | Create a new course | 🔒 🎓 |
| PATCH | `/api/courses/:id` | Update a course | 🔒 🎓 |
| DELETE | `/api/courses/:id` | Delete a course | 🔒 👑 |

### Request Bodies

**POST /api/courses**
```json
{
  "title": "Introduction to Backend Development",
  "description": "Learn how to build REST APIs with Node.js",
  "thumbnail": "https://link-to-thumbnail.com/image.png"
}
```

**PATCH /api/courses/:id**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "is_published": true
}
```

---

## 📋 Enrollment — Toria

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/courses/:id/enroll` | Enroll in a course | 🔒 |
| GET | `/api/courses/:id/enrollees` | Get all enrolled users | 🔒 🎓 |

---

## 📖 Lessons — Toria

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses/:id/lessons` | Get all lessons in a course | 🔒 |
| POST | `/api/courses/:id/lessons` | Add lesson to course | 🔒 🎓 |
| GET | `/api/courses/:id/lessons/:lessonId` | Get single lesson | 🔒 |
| PATCH | `/api/courses/:id/lessons/:lessonId` | Update a lesson | 🔒 🎓 |
| DELETE | `/api/courses/:id/lessons/:lessonId` | Delete a lesson | 🔒 🎓 |
| POST | `/api/courses/:id/lessons/:lessonId/complete` | Mark lesson as completed | 🔒 |

### Request Bodies

**POST /api/courses/:id/lessons**
```json
{
  "title": "Introduction to Express.js",
  "content": "In this lesson we will learn...",
  "video_url": "https://link-to-video.com",
  "document_url": "https://link-to-document.com",
  "order_number": 1
}
```

---

## 📝 Assignments — Temyl

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses/:id/assignments` | Get all assignments in a course | 🔒 |
| POST | `/api/courses/:id/assignments` | Create an assignment | 🔒 🎓 |
| GET | `/api/assignments/:id` | Get single assignment | 🔒 |
| PATCH | `/api/assignments/:id` | Update an assignment | 🔒 🎓 |
| DELETE | `/api/assignments/:id` | Delete an assignment | 🔒 🎓 |

### Request Bodies

**POST /api/courses/:id/assignments**
```json
{
  "title": "Build a REST API",
  "description": "Build a simple REST API using Express.js",
  "due_date": "2026-03-30T23:59:00Z"
}
```

---

## 📤 Submissions — Temyl

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/assignments/:id/submit` | Submit an assignment | 🔒 |
| GET | `/api/assignments/:id/submissions` | Get all submissions | 🔒 🎓 |
| GET | `/api/assignments/:id/submissions/:userId` | Get one user's submission | 🔒 🎓 |
| PATCH | `/api/assignments/:id/submissions/:userId/grade` | Grade a submission | 🔒 🎓 |

### Request Bodies

**POST /api/assignments/:id/submit**
```json
{
  "content": "Here is my assignment submission...",
  "file_url": "https://link-to-file.com"
}
```

**PATCH /api/assignments/:id/submissions/:userId/grade**
```json
{
  "grade": "A",
  "feedback": "Excellent work! Clean code and well documented."
}
```

---

## 📊 Progress — Temyl

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/progress` | Get my overall progress | 🔒 |
| GET | `/api/progress/courses/:courseId` | Get my progress in a course | 🔒 |

> Progress is calculated automatically when a learner marks a lesson as complete.
> When progress reaches 100%, a certificate is issued automatically.

---

## 🏆 Certificates — Temyl

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/certificates` | Get all my certificates | 🔒 |
| GET | `/api/certificates/:id` | Get single certificate | 🔒 |

> Certificates are issued automatically — no manual creation needed.

---

## 💬 Discussions — Shared (Do Last)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses/:id/discussions` | Get all discussions in a course | 🔒 |
| POST | `/api/courses/:id/discussions` | Post a new discussion | 🔒 |
| POST | `/api/courses/:id/discussions/:postId/reply` | Reply to a discussion | 🔒 |
| DELETE | `/api/courses/:id/discussions/:postId` | Delete a post | 🔒 |

---

## 📌 General Rules for All Developers

**1. Always use the response helper:**
```javascript
const { success, error } = require("../../utils/response");

// Success
return success(res, "User created successfully", { user }, 201);

// Error
return error(res, "User not found", 404);
```

**2. Always protect routes that need authentication:**
```javascript
const { protect } = require("../../middlewares/auth.middleware");
const { allowRoles } = require("../../middlewares/role.middleware");

// Protected route
router.get("/profile", protect, UserController.getProfile);

// Role protected route
router.post("/", protect, allowRoles("instructor", "admin"), CourseController.createCourse);
```

**3. Branch rules:**
- Toria → `feature/users-courses`
- Emmanuel → `feature/auth-notifications`
- Temyl → `feature/assignments-progress`

**4. Never push to `main`**

**5. Open a Pull Request when your module is ready and tag Toria for review**