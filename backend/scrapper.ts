// apps/backend/src/scraper.ts
export async function scrapeLeetCodeProfile(username: string): Promise<LeetCodeStats> {
  // Real scraper would use puppeteer/cheerio
  // For demo, return mock data
  const mockData = {
    username,
    solved: Math.floor(Math.random() * 2000) + 500,
    streak: Math.floor(Math.random() * 100) + 10,
    acceptanceRate: Math.floor(Math.random() * 30) + 60,
    easy: Math.floor(Math.random() * 500) + 200,
    medium: Math.floor(Math.random() * 1000) + 200,
    hard: Math.floor(Math.random() * 300) + 50
  };
  
  return mockData;
}
