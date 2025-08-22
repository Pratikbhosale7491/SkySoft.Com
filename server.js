const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg"); // PostgreSQL client
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// 👉 Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,     // e.g. skysoft-db.cvamyc0eec1v.ap-south-1.rds.amazonaws.com
  user: process.env.DB_USER,     // e.g. postgres
  password: process.env.DB_PASS, // your RDS password
  database: process.env.DB_NAME, // e.g. skysoft
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // required for AWS RDS SSL
  },
});

// Contact API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id",
      [name, email, message]
    );
    res.json({ message: "✅ Thank you! Your message was saved.", id: result.rows[0].id });
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ error: "Database error. Please try again later." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
