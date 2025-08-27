import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authentication from "./routes/Authentication.js";
import exam from "./routes/examsetting.js";
import adminRoutes from "./routes/adminroutes.js";
import studentRoute from "./routes/studentroutes.js";

dotenv.config();

const app = express();

// ----------------- Fix __dirname in ESM -----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------- CORS -----------------
const allowedOrigins = [
  "https://quick-test-platform.vercel.app",
  "https://quick-test-platform.netlify.app",
  "http://localhost:4000",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ----------------- Middlewares -----------------
app.use(express.json());

// ✅ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// (Optional) if you want to serve frontend separately
app.use("/frontend", express.static(path.join(__dirname, "..", "frontend")));

// ----------------- Routes -----------------
app.use("/api/authenticate", authentication);
app.use("/api/setExam", exam);
app.use("/api/admin", adminRoutes);
app.use("/api/user", studentRoute);

// ----------------- Health check route -----------------
app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false
  });
});

// ----------------- MongoDB -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB error:", error));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas"));

// ----------------- Start server -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
});
