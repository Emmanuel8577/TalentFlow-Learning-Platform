const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const keepAlive = require('./utils/keepAlive');

require("dotenv").config();
require("./config/db");
const migrate = require("./db/migrate");

// IMPORT: Swagger documentation
const swaggerDocument = require('./swagger.json'); 

const app = express(); 

// Run migrations on startup
migrate();

// Environment Detection
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const PORT = process.env.PORT || 5000;
const BASE_URL = isProduction 
  ? 'https://talentflow-backend-4dd1.onrender.com' 
  : `http://localhost:${PORT}`;

// ── SWAGGER CONFIGURATION ──────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ── MIDDLEWARE ─────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const { error, success } = require("./utils/response");

// ── ROUTES ─────────────────────────────────────────
app.use("/api/auth",            require("./modules/auth/auth.routes"));
app.use("/api/users",           require("./modules/users/user.routes"));
app.use("/api/courses",          require("./modules/courses/course.routes"));
app.use("/api/courses/:id/lessons", require("./modules/lessons/lesson.routes"));
app.use("/api/assignments",     require("./modules/assignments/assignment.routes"));
app.use("/api/progress",        require("./modules/progress/progress.routes"));
app.use("/api/certificates",    require("./modules/certificates/certificate.routes"));
app.use("/api/notifications",   require("./modules/notifications/notification.routes"));
app.use("/api/discussions",     require("./modules/discussions/discussion.routes"));

app.get("/", (req, res) => {
  return success(res, "TalentFlow LMS API 🎓", {
    status: "Server is running",
    version: "1.0.0",
    docs: `${BASE_URL}/api-docs`
  });
});

// ── ERROR HANDLERS ─────────────────────────────────
app.use((req, res) => {
  return error(res, "Route not found", 404);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  return error(res, "Something went wrong on our end.", 500);
});

// ── SERVER START ───────────────────────────────────
app.listen(PORT, () => {
  console.log(`TalentFlow API running on port ${PORT}`);
  console.log(`Swagger docs available at ${BASE_URL}/api-docs`);

  // Start the self-ping logic to prevent Render sleep (Production Only)
  if (isProduction) {
    keepAlive(BASE_URL);
  }
});

module.exports = app;