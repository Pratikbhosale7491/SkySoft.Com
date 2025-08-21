const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ Use PORT from environment variable, fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// 👉 Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Contact API
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  const entry = `Name: ${name}, Email: ${email}, Message: ${message}\n`;

  fs.appendFileSync("messages.txt", entry);

  res.json({ message: "✅ Thank you! Your message was received." });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
