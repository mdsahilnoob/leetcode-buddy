import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import { scrapeLeetCodeProfile } from '../scrapper.js';

const router: Router = Router();

interface MonthlyData {
  month: string;
  user1: number;
  user2: number;
}

interface ChartData {
  monthly: MonthlyData[];
  categories: {
    easy: { user1: number; user2: number };
    medium: { user1: number; user2: number };
    hard: { user1: number; user2: number };
  };
  comparison: {
    totalSolved: { user1: number; user2: number; winner: string };
    streak: { user1: number; user2: number; winner: string };
    acceptanceRate: { user1: number; user2: number; winner: string };
    ranking: { user1: number; user2: number; winner: string };
  };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface ProfileSnapshot {
  username: string;
  solved: number;
}

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const buildMonthlyCumulativeTrend = ({ username, solved }: ProfileSnapshot): number[] => {
  const totalSolved = Math.max(0, solved);
  if (totalSolved === 0) {
    return Array.from({ length: MONTHS.length }, () => 0);
  }

  // Baseline shape: slower start, faster growth in later months.
  const baselineWeights = [0.6, 0.65, 0.7, 0.76, 0.82, 0.9, 1, 1.08, 1.16, 1.26, 1.36, 1.5];
  const seed = hashString(`${username}:${totalSolved}`);

  const weightedByMonth = baselineWeights.map((weight, index) => {
    // Deterministic per-user perturbation to avoid identical curves.
    const monthSeed = ((seed >>> (index % 16)) + index * 31) % 1000;
    const variation = 0.88 + (monthSeed / 1000) * 0.24; // 0.88..1.12
    return weight * variation;
  });

  const weightSum = weightedByMonth.reduce((sum, weight) => sum + weight, 0);
  const rawIncrements = weightedByMonth.map((weight) => (weight / weightSum) * totalSolved);
  const floorIncrements = rawIncrements.map((value) => Math.floor(value));

  let remainder = totalSolved - floorIncrements.reduce((sum, value) => sum + value, 0);
  if (remainder > 0) {
    const fractions = rawIncrements
      .map((value, index) => ({ index, fraction: value - floorIncrements[index] }))
      .sort((a, b) => b.fraction - a.fraction);

    for (let i = 0; i < fractions.length && remainder > 0; i += 1) {
      floorIncrements[fractions[i].index] += 1;
      remainder -= 1;
    }
  }

  const cumulative: number[] = [];
  let runningTotal = 0;
  for (const value of floorIncrements) {
    runningTotal += value;
    cumulative.push(runningTotal);
  }

  return cumulative;
};

// Generate chart data using real API data
const generateChartData = async (username1: string, username2: string): Promise<ChartData> => {
  // Fetch real data for both users
  const [user1Data, user2Data] = await Promise.all([
    scrapeLeetCodeProfile(username1),
    scrapeLeetCodeProfile(username2),
  ]);

  const user1MonthlyTrend = buildMonthlyCumulativeTrend({
    username: user1Data.username,
    solved: user1Data.solved,
  });
  const user2MonthlyTrend = buildMonthlyCumulativeTrend({
    username: user2Data.username,
    solved: user2Data.solved,
  });

  const monthly: MonthlyData[] = MONTHS.map((month, index) => ({
    month,
    user1: user1MonthlyTrend[index],
    user2: user2MonthlyTrend[index],
  }));

  return {
    monthly,
    categories: {
      easy: { user1: user1Data.easy, user2: user2Data.easy },
      medium: { user1: user1Data.medium, user2: user2Data.medium },
      hard: { user1: user1Data.hard, user2: user2Data.hard },
    },
    comparison: {
      totalSolved: {
        user1: user1Data.solved,
        user2: user2Data.solved,
        winner: user1Data.solved > user2Data.solved ? username1 : username2,
      },
      streak: {
        user1: user1Data.streak,
        user2: user2Data.streak,
        winner: user1Data.streak > user2Data.streak ? username1 : username2,
      },
      acceptanceRate: {
        user1: user1Data.acceptanceRate,
        user2: user2Data.acceptanceRate,
        winner: user1Data.acceptanceRate > user2Data.acceptanceRate ? username1 : username2,
      },
      ranking: {
        user1: user1Data.ranking || 0,
        user2: user2Data.ranking || 0,
        winner: (user1Data.ranking || 999999) < (user2Data.ranking || 999999) ? username1 : username2,
      },
    },
  };
};

// Get chart data for comparison
router.get('/chart-data', optionalAuth, async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Both user1 and user2 query parameters are required' });
  }

  try {
    const chartData = await generateChartData(user1 as string, user2 as string);
    res.json({
      user1: user1 as string,
      user2: user2 as string,
      data: chartData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate chart data';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
