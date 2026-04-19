// =============================================
//  Request Routes
//  Blood request endpoints + notifications
// =============================================

const express = require("express");
const router  = express.Router();

const Request = require("./Request");
const Donor   = require("./Donor");

// 👉 Import utils
const sendEmail = require("./utils/sendEmail");
const sendSMS   = require("./utils/sendSMS");


// =============================================
// GET /api/requests - get all open requests
// =============================================
router.get("/", async (req, res) => {
  try {
    const filter = { status: "open" };
    if (req.query.bloodType) filter.bloodType = req.query.bloodType;

    const requests = await Request.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});


// =============================================
// POST /api/requests/new
// =============================================
router.post("/new", async (req, res) => {
  try {
    console.log("🔥 REQUEST RECEIVED");
    console.log("📦 BODY:", req.body);

    const request = new Request(req.body);
    await request.save();

    console.log("🩸 Blood Type Requested:", request.bloodType);

    // 🔍 Find donors
    const donors = await Donor.find({
      bloodType: request.bloodType,
      isAvailable: true
    });

    console.log("👥 Total donors found:", donors.length);

    // ⚠️ TEMP: skip eligibility filter for testing
    const eligibleDonors = donors;

    console.log("✅ Eligible donors:", eligibleDonors.length);

    // 🚀 Send notifications
    await Promise.all(
      eligibleDonors.map(async (donor) => {
        try {
          console.log("➡️ Sending to:", donor.email, donor.phone);

          // 📧 EMAIL
          if (donor.email) {
            await sendEmail(
              donor.email,
              "🚨 Blood Request Alert",
              `Blood (${request.bloodType}) needed at ${request.hospital}.
Contact: ${request.phone}
Urgency: ${request.urgency}`
            );
          }

          // 📱 SMS
          if (donor.phone) {
            await sendSMS(
              donor.phone,
              `URGENT: ${request.bloodType} needed at ${request.hospital}. Contact: ${request.phone}`
            );
          }

        } catch (err) {
          console.error("❌ Notification failed for:", donor.email || donor.phone);
          console.error(err.message);
        }
      })
    );

    res.status(201).json({
      message: "Blood request submitted & donors notified!",
      request,
      notifiedDonors: eligibleDonors.length
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to submit request: " + err.message });
  }
});


// =============================================
// PUT /api/requests/:id/close
// =============================================
router.put("/:id/close", async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "fulfilled" },
      { new: true }
    );

    if (!request) return res.status(404).json({ error: "Request not found" });

    res.json({ message: "Request marked as fulfilled", request });
  } catch (err) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

module.exports = router;