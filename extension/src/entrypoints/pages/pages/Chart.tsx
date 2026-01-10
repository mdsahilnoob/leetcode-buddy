import { useState, useEffect } from 'react';

interface UserStats {
  username: string;
  solved: number;
  streak: number;
  acceptanceRate: number;
  easy?: number;
  medium?: number;
  hard?: number;
}

interface ComparisonData {
  user1: UserStats;
  user2: UserStats;
  winner: string;
}

interface ChartProps {
  user1: string;
  user2: string;
  onBack: () => void;
}

export default function Chart({ user1, user2, onBack }: ChartProps) {
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3001/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username1: user1, username2: user2 }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch comparison data');
        
        const data = await response.json();
        setComparison(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Comparison failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [user1, user2]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#c9d1d9] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="bg-[#161b22] border border-[#f85149] rounded-lg p-6 text-center">
          <p className="text-[#f85149] text-sm mb-3">Error: {error}</p>
          <button
            onClick={onBack}
            className="bg-[#21262d] hover:bg-[#30363d] text-white px-4 py-1.5 rounded-md text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="h-screen bg-[#0d1117] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-3 flex items-center gap-1.5 text-[#8b949e] hover:text-[#58a6ff] transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold text-white">
              Comparison
            </h1>
          </div>

          {/* VS Section */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 mb-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="text-center p-4 rounded-lg bg-[#0d1117] border border-[#30363d] flex-1 w-full sm:w-auto">
              <div className="w-14 h-14 bg-[#238636] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-semibold text-white">{comparison.user1.username.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="font-semibold text-base text-white">{comparison.user1.username}</div>
            </div>

            <div className="text-2xl font-bold text-[#8b949e]">
              VS
            </div>

            <div className="text-center p-4 rounded-lg bg-[#0d1117] border border-[#30363d] flex-1 w-full sm:w-auto">
              <div className="w-14 h-14 bg-[#1f6feb] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-semibold text-white">{comparison.user2.username.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="font-semibold text-base text-white">{comparison.user2.username}</div>
            </div>
          </div>
        </div>

        {/* Winner Card */}
        <div className={`p-5 rounded-lg border text-center mb-5 ${
          comparison.user1.solved > comparison.user2.solved
            ? 'bg-[#161b22] border-[#238636]'
            : 'bg-[#161b22] border-[#1f6feb]'
        }`}>
          <div className="w-14 h-14 bg-[#ffa657] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🏆</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {comparison.user1.solved > comparison.user2.solved ? comparison.user1.username : comparison.user2.username} Wins!
          </h2>
          <p className="text-base text-[#8b949e]">
            {Math.abs(comparison.user1.solved - comparison.user2.solved)} problems ahead
          </p>
        </div>

          {/* Stats Grid */}
          <div className="space-y-3">
            {/* Solved Problems */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#238636] rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">✓</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Solved</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e] text-xs truncate">{comparison.user1.username}</span>
                  <span className="text-base font-bold text-[#58a6ff]">{comparison.user1.solved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e] text-xs truncate">{comparison.user2.username}</span>
                  <span className="text-base font-bold text-[#58a6ff]">{comparison.user2.solved}</span>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#da3633] rounded flex items-center justify-center">
                  <span className="text-xs">🔥</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Streak</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e] text-xs truncate">{comparison.user1.username}</span>
                  <span className="text-base font-bold text-[#f85149]">{comparison.user1.streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e] text-xs truncate">{comparison.user2.username}</span>
                  <span className="text-base font-bold text-[#f85149]">{comparison.user2.streak} days</span>
                </div>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[#1f6feb] rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">%</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Acceptance Rate</h3>
              </div>
              <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#8b949e]">{comparison.user1.username}</span>
                  <span className="text-lg font-bold text-[#58a6ff]">{comparison.user1.acceptanceRate.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#238636] rounded-full transition-all duration-1000"
                    style={{ width: `${comparison.user1.acceptanceRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#8b949e]">{comparison.user2.username}</span>
                  <span className="text-lg font-bold text-[#58a6ff]">{comparison.user2.acceptanceRate.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#238636] rounded-full transition-all duration-1000"
                    style={{ width: `${comparison.user2.acceptanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

            {/* Difficulty Breakdown */}
            {(comparison.user1.easy !== undefined || comparison.user1.medium !== undefined || comparison.user1.hard !== undefined) && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-[#6e7681] rounded flex items-center justify-center">
                    <span className="text-xs">📊</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Difficulty</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-[#58a6ff] mb-2 truncate">{comparison.user1.username}</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-2 py-1.5 bg-[#0d1117] rounded">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full"></div>
                          <span className="text-[#c9d1d9] text-xs">Easy</span>
                        </div>
                        <span className="text-sm font-bold text-[#3fb950]">{comparison.user1.easy || 0}</span>
                      </div>
                      <div className="flex justify-between items-center px-2 py-1.5 bg-[#0d1117] rounded">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#d29922] rounded-full"></div>
                          <span className="text-[#c9d1d9] text-xs">Med</span>
                        </div>
                        <span className="text-sm font-bold text-[#d29922]">{comparison.user1.medium || 0}</span>
                      </div>
                      <div className="flex justify-between items-center px-2 py-1.5 bg-[#0d1117] rounded">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#f85149] rounded-full"></div>
                          <span className="text-[#c9d1d9] text-xs">Hard</span>
                        </div>
                        <span className="text-sm font-bold text-[#f85149]">{comparison.user1.hard || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#58a6ff] mb-2 truncate">{comparison.user2.username}</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-2 py-1.5 bg-[#0d1117] rounded">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full"></div>
                          <span className="text-[#c9d1d9] text-xs">Easy</span>
                        </div>
                        <span className="text-sm font-bold text-[#3fb950]">{comparison.user2.easy || 0}</span>
                      </div>
                      <div className="flex justify-between items-center px-2 py-1.5 bg-[#0d1117] rounded">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#d29922] rounded-full"></div>
                          <span className="text-[#c9d1d9] text-xs">Med</span>
                        </div>
                        <span className="text-sm font-bold text-[#d29922]">{comparison.user2.medium || 0}</span>
                      </div>
                      <div className="flex justify-between items-center px-2 py-1.5 bg-[#0d1117] rounded">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#f85149] rounded-full"></div>
                          <span className="text-[#c9d1d9] text-xs">Hard</span>
                        </div>
                        <span className="text-sm font-bold text-[#f85149]">{comparison.user2.hard || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
