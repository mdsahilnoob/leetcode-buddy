import { config } from './config/config.route.js';

interface LeetCodeStats {
  username: string;
  solved: number;
  streak: number;
  acceptanceRate: number;
  easy: number;
  medium: number;
  hard: number;
  ranking?: number;
}

interface LeetCodeAPIResponse {
  matchedUser: {
    username: string;
    profile: {
      ranking: number;
    };
    submitStatsGlobal: {
      acSubmissionNum: Array<{
        difficulty: string;
        count: number;
      }>;
    };
  };
}

export async function scrapeLeetCodeProfile(username: string): Promise<LeetCodeStats> {
  try {
    const response = await fetch(`${config.leetcodeApiUrl}/api/leetcode/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json() as LeetCodeAPIResponse;
    const { matchedUser } = data;

    if (!matchedUser) {
      throw new Error('User not found');
    }

    const submissions = matchedUser.submitStatsGlobal.acSubmissionNum;
    const allCount = submissions.find(s => s.difficulty === 'All')?.count || 0;
    const easyCount = submissions.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumCount = submissions.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardCount = submissions.find(s => s.difficulty === 'Hard')?.count || 0;

    return {
      username: matchedUser.username,
      solved: allCount,
      streak: 0,
      acceptanceRate: allCount > 0 ? Math.floor((allCount / (allCount + 100)) * 100) : 0,
      easy: easyCount,
      medium: mediumCount,
      hard: hardCount,
      ranking: matchedUser.profile.ranking,
    };
  } catch (error) {
    console.error(`Failed to fetch LeetCode profile for ${username}:`, error);
    throw new Error(`Failed to fetch profile for ${username}`);
  }
}
