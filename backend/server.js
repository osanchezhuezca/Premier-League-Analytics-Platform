// backend/server.js
// =====================================================
// FUTSTAT BACKEND SERVER
// =====================================================
const pool = require("./database");
const express = require("express");
const cors = require("cors");
const path = require("path");

// ✅ Load environment variables
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// ROUTES IMPORTS
// =====================================================
const teamRoutes = require("./routes/teams");
const fixtureRoutes = require("./routes/fixtures");
const predictionsRoutes = require("./routes/predictions");

app.use("/api/teams", teamRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/predictions", predictionsRoutes);

// =====================================================
// HEALTH CHECK
// =====================================================
app.get("/", (req, res) => {
res.send("✅ Futstat Backend is running ⚽");
});

app.get("/test-db", async (req, res) => {
try {
  const result = await pool.query("SELECT NOW()");
  res.json({ ok: true, time: result.rows[0] });
} catch (error) {
  console.error(error);
  res.status(500).json({ ok: false, error });
}
});

// =====================================================
// LIVE PREMIER LEAGUE DATA ROUTE
// =====================================================
// LIVE MATCHES
app.get("/api/live", async (req, res) => {
try {
  const apiKey = process.env.HOME_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing HOME_API_KEY");
    return res.status(500).json({ error: "Missing API key" });
  }

  const response = await fetch(
    "https://api.football-data.org/v4/competitions/PL/matches",
    {
      headers: { "X-Auth-Token": apiKey },
    }
  );

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch matches" });
  }

  const data = await response.json();
  res.json(data);
} catch (err) {
  console.error("💥 Server error fetching live data:", err);
  res.status(500).json({ error: "Internal Server Error" });
}
});

// LEAGUE TABLE
app.get("/api/table", async (req, res) => {
try {
  const apiKey = process.env.HOME_API_KEY;

  const response = await fetch(
    "https://api.football-data.org/v4/competitions/PL/standings",
    {
      headers: { "X-Auth-Token": apiKey },
    }
  );

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch standings" });
  }

  const data = await response.json();
  res.json(data.standings?.[0]?.table || []);
} catch (err) {
  console.error("Error fetching table:", err);
  res.status(500).json({ error: "Server error fetching table" });
}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📊 API Routes available:`);
console.log(`   - /api/teams`);
console.log(`   - /api/fixtures`);
console.log(`   - /api/predictions`);
console.log(`   - /api/live`);
console.log(`   - /api/table`);
});