// =============================================
//  Donor Routes
//  All API endpoints related to donors
// =============================================

const express = require("express");
const router  = express.Router();
const Donor = require("./Donor");

// GET /api/donors - get all available donors (optional: filter by blood type)
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.bloodType) filter.bloodType = req.query.bloodType;
    if (req.query.city)      filter["location.city"] = new RegExp(req.query.city, "i");

    const donors = await Donor.find(filter).select("-email");  // hide email for privacy
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

// POST /api/donors/register - register a new donor
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, bloodType, lastDonationDate, location } = req.body;

    // Check if email already registered
    const existing = await Donor.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered as a donor" });
    }

    const donor = new Donor({ name, email, phone, bloodType, lastDonationDate, location });
    await donor.save();

    // Check if they can donate right now
    const eligible = donor.canDonate();

    res.status(201).json({
      message: "Donor registered successfully!",
      donor,
      canDonateNow: eligible,
      note: eligible
        ? "You are eligible to donate blood."
        : "You donated recently. You can donate again after 90 days from your last donation.",
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
});

// GET /api/donors/:id/check - check if a specific donor can donate
router.get("/:id/check", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    const eligible = donor.canDonate();

    res.json({
      name:          donor.name,
      bloodType:     donor.bloodType,
      canDonate:     eligible,
      lastDonation:  donor.lastDonationDate,
      message: eligible
        ? "This donor is eligible to donate."
        : "This donor donated within the last 90 days and is not yet eligible.",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to check donor" });
  }
});

// PUT /api/donors/:id/donate - record a new donation
router.put("/:id/donate", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    if (!donor.canDonate()) {
      return res.status(400).json({
        error: "Donor is not eligible to donate yet (must wait 90 days between donations)",
      });
    }

    donor.lastDonationDate = new Date();
    await donor.save();

    res.json({ message: "Donation recorded successfully!", donor });
  } catch (err) {
    res.status(500).json({ error: "Failed to record donation" });
  }
});

module.exports = router;
