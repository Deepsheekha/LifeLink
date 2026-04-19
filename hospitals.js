// =============================================
//  Hospital Routes
//  All API endpoints related to hospitals
// =============================================

const express  = require("express");
const router   = express.Router();
const Hospital = require("./Hospital");

// GET /api/hospitals - get all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

// GET /api/hospitals/:id - get one hospital with its blood stock
router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hospital" });
  }
});

// POST /api/hospitals/add - add a new hospital
router.post("/add", async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ message: "Hospital added!", hospital });
  } catch (err) {
    res.status(500).json({ error: "Failed to add hospital: " + err.message });
  }
});

// PUT /api/hospitals/:id/stock - update blood stock for a hospital
router.put("/:id/stock", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });

    // req.body should be like: { "A+": 10, "O-": 5 }
    Object.keys(req.body).forEach((bloodType) => {
      if (hospital.bloodStock[bloodType] !== undefined) {
        hospital.bloodStock[bloodType] = req.body[bloodType];
      }
    });

    hospital.updatedAt = new Date();
    await hospital.save();

    res.json({ message: "Blood stock updated!", hospital });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stock" });
  }
});

module.exports = router;
