// =============================================
//  Request Model
//  A blood request made by a patient or hospital
// =============================================

const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requesterName: {
    type: String,
    required: true,
    trim: true,
  },
  requesterType: {
    type: String,
    enum: ["patient", "hospital", "family"],  // types of requesters
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  unitsNeeded: {
    type: Number,
    required: true,
    min: 1,
  },
  urgency: {
    type: String,
    enum: ["normal", "urgent", "critical"],
    default: "normal",
  },
  phone: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,   // name of hospital where blood is needed
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["open", "fulfilled", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", requestSchema);
