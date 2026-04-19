const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: String,
  phone: String,

  location: {
    lat: Number,
    lng: Number,
  },

  bloodStock: {
    "A+": { type: Number, default: 0 },
    "A-": { type: Number, default: 0 },
    "B+": { type: Number, default: 0 },
    "B-": { type: Number, default: 0 },
    "AB+": { type: Number, default: 0 },
    "AB-": { type: Number, default: 0 },
    "O+": { type: Number, default: 0 },
    "O-": { type: Number, default: 0 },
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);