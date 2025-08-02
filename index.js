const express = require("express");
require("dotenv").config();

const app = express();
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.use("/api", movieRoutes);
app.use("/api/auth", authRoutes); // ✅ New auth route

app.get("/", (req, res) => res.send("🎬 Movie Explorer Backend is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
