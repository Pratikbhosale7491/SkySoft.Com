const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");  // PostgreSQL client
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Setup PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",           // RDS master username
  host: process.env.DB_HOST || "your-rds-endpoint",  // e.g. skysoft-db.xxxxx.us-east-1.rds.amazonaws.com
  database: process.env.DB_NAME || "postgres",       // default DB name
  password: process.env.DB_PASS || "yourpassword",   // RDS password
  port: 5432,
});

// ✅ Create table if not exists
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Contacts table is ready!");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
})();

// Contact API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.json({ message: "✅ Thank you! Your message was saved in the database." });
  } catch (err) {
    console.error("❌ DB insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
