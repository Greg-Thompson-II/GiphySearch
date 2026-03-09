import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";

if (!GIPHY_API_KEY) {
  console.error("Missing GIPHY_API_KEY in environment variables.");
  process.exit(1);
}

app.get("/api/gifs/trending", async (_req, res) => {
  try {
    const response = await fetch(
      `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=10&bundle=low_bandwidth`,
    );

    if (response.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
      return;
    }
    if (!response.ok) {
      res.status(response.status).json({ error: `Request failed with status ${response.status}.` });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending GIFs:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/gifs/search", async (req, res) => {
  const q = req.query.q as string;

  if (!q || !q.trim()) {
    res.status(400).json({ error: "Missing search query." });
    return;
  }

  try {
    const response = await fetch(
      `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(q)}&limit=30&bundle=low_bandwidth`,
    );

    if (response.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
      return;
    }
    if (!response.ok) {
      res.status(response.status).json({ error: `Request failed with status ${response.status}.` });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching searched GIFs:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Serve the built frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
