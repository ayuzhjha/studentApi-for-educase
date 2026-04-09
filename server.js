const express = require("express");
const { initDB } = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

// Routes
app.use("/", require("./routes/schools"));

// Health check
app.get("/", (req, res) => res.json({ status: "School Management API is running." }));

const PORT = process.env.PORT || 3000;

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize DB:", err);
    process.exit(1);
  });
