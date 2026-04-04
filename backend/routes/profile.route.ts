import { Router } from 'express';
import { scrapeLeetCodeProfile } from '../scrapper.js';

const router: Router = Router();

interface ProfileData {
  username: string;
  solved: number;
  streak: number;
  acceptanceRate: number;
  easy: number;
  medium: number;
  hard: number;
  ranking?: number;
  contributionPoints?: number;
  reputation?: number;
}

// Get single user profile (public - no auth required)
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const profile = await scrapeLeetCodeProfile(username);
    res.json(profile);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
