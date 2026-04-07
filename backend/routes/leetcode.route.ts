import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { scrapeLeetCodeProfile } from '../scrapper.js';

const router: Router = Router();

interface LeetCodeStats {
  username: string;
  solved: number;
  streak: number;
  acceptanceRate: number;
  easy: number;
  medium: number;
  hard: number;
}

router.post('/compare', authenticateToken, async (req, res) => {
  const { username1, username2 } = req.body;

  if (!username1 || !username2) {
    return res.status(400).json({ error: 'Both usernames are required' });
  }

  try {
    const [user1, user2] = await Promise.all([
      scrapeLeetCodeProfile(username1),
      scrapeLeetCodeProfile(username2),
    ]);

    const comparison = {
      user1,
      user2,
      winner: user1.solved > user2.solved ? username1 : username2,
      difference: Math.abs(user1.solved - user2.solved),
      comparedBy: req.user?.email,
      timestamp: new Date().toISOString(),
    };

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

export default router;
