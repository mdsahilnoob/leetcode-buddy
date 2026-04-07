import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router: Router = Router();

interface Comparison {
  id: string;
  user1: string;
  user2: string;
  timestamp: string;
  comparedBy: string;
}

const comparisonHistory = new Map<string, Comparison[]>();

router.get('/history', authenticateToken, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const history = comparisonHistory.get(userId) || [];
  res.json({ history });
});

router.post('/history', authenticateToken, async (req, res) => {
  const { user1, user2 } = req.body;
  const userId = req.user?.userId;
  const userEmail = req.user?.email;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Both usernames are required' });
  }

  const comparison: Comparison = {
    id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user1,
    user2,
    timestamp: new Date().toISOString(),
    comparedBy: userEmail || 'unknown',
  };

  const userHistory = comparisonHistory.get(userId) || [];
  userHistory.unshift(comparison);
  
  if (userHistory.length > 50) {
    userHistory.pop();
  }

  comparisonHistory.set(userId, userHistory);

  res.json({ 
    message: 'Comparison saved to history',
    comparison 
  });
});

router.delete('/history/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userHistory = comparisonHistory.get(userId) || [];
  const filteredHistory = userHistory.filter(c => c.id !== id);
  comparisonHistory.set(userId, filteredHistory);

  res.json({ message: 'Comparison deleted from history' });
});

router.delete('/history', authenticateToken, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  comparisonHistory.delete(userId);
  res.json({ message: 'All comparison history cleared' });
});

export default router;
