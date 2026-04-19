// =============================================
//  Donor Model
//  Stores donor registration and donation history
// =============================================

const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  lastDonationDate: {
    type: Date,
    default: null,    // null means never donated before
  },
  location: {
    city: { type: String, required: true },
    lat:  { type: Number },   // latitude for map
    lng:  { type: Number },   // longitude for map
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// --- Helper method: check if donor can donate ---
// Donors must wait 90 days (3 months) between donations
donorSchema.methods.canDonate = function () {
  if (!this.lastDonationDate) return true;  // never donated, can donate

  const today        = new Date();
  const lastDonation = new Date(this.lastDonationDate);
  const daysSince    = (today - lastDonation) / (1000 * 60 * 60 * 24);  // ms to days

  return daysSince >= 90;
};

module.exports = mongoose.model("Donor", donorSchema);
