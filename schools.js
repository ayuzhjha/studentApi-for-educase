const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Haversine formula to calculate distance in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// POST /addSchool
router.post("/addSchool", async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing 'name'." });
  }
  if (!address || typeof address !== "string" || address.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing 'address'." });
  }
  if (latitude === undefined || isNaN(parseFloat(latitude)) || latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: "Invalid or missing 'latitude'. Must be between -90 and 90." });
  }
  if (longitude === undefined || isNaN(parseFloat(longitude)) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: "Invalid or missing 'longitude'. Must be between -180 and 180." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );
    res.status(201).json({
      message: "School added successfully.",
      schoolId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
});

// GET /listSchools?latitude=xx&longitude=yy
router.get("/listSchools", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (latitude === undefined || isNaN(parseFloat(latitude)) || latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: "Invalid or missing 'latitude'." });
  }
  if (longitude === undefined || isNaN(parseFloat(longitude)) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: "Invalid or missing 'longitude'." });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  try {
    const [schools] = await pool.query("SELECT * FROM schools");

    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          getDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    res.json({ count: sorted.length, schools: sorted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
});

module.exports = router;
