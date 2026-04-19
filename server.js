// =============================================
//  LifeLink - Main Server File
// =============================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lifelink")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Routes ---
const donorRoutes    = require("./donors");
const hospitalRoutes = require("./hospitals");
const requestRoutes  = require("./requests");

app.use("/api/donors", donorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/requests", requestRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 LifeLink running at http://localhost:${PORT}`);
});