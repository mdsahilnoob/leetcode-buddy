// apps/backend/src/server.ts
import express from "express";
import cors from "cors";
import { scrapeLeetCodeProfile } from "./scraper.js";

const app = express();
app.use(cors());
app.use(express.json());

interface LeetCodeStats {
  username: string;
  solved: number;
  streak: number;
  acceptanceRate: number;
  easy: number;
  medium: number;
  hard: number;
}

app.post("/api/compare", async (req, res) => {
  const { username1, username2 } = req.body;

  try {
    const [user1, user2] = await Promise.all([
      scrapeLeetCodeProfile(username1),
      scrapeLeetCodeProfile(username2)
    ]);

    const comparison = {
      user1,
      user2,
      winner: user1.solved > user2.solved ? username1 : username2,
      difference: Math.abs(user1.solved - user2.solved)
    };

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

app.listen(3001, () => {
  console.log("LeetBuddy API: http://localhost:3000");
});
