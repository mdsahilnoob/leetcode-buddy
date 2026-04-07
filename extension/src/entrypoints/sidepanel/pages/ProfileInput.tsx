import { useState } from 'react';
import { profileAPI, type UserStats } from '@/services/api';

interface ProfileInputProps {
  onCompare: (payload: {
    user1: string;
    user2: string;
    profile1: UserStats;
    profile2: UserStats;
  }) => void;
}

export default function ProfileInput({ onCompare }: ProfileInputProps) {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1 || !user2) return;
    const trimmedUser1 = user1.trim();
    const trimmedUser2 = user2.trim();
    if (!trimmedUser1 || !trimmedUser2) return;
    
    setLoading(true);
    setError(null);

    try {
      const [profile1, profile2] = await Promise.all([
        profileAPI.getProfile(trimmedUser1),
        profileAPI.getProfile(trimmedUser2)
      ]);
      
      onCompare({ user1: trimmedUser1, user2: trimmedUser2, profile1, profile2 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles. Please check usernames.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0d1117] p-4">
      <div className="h-full flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-white mb-1">
            Compare Profiles
          </h1>
          <p className="text-[#8b949e] text-xs">
            Enter two LeetCode usernames
          </p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="user1" className="block text-sm font-medium text-[#c9d1d9]">
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#238636] rounded flex items-center justify-center text-white font-semibold text-sm">
                    1
                  </span>
                  First Username
                </span>
              </label>
              <input
                id="user1"
                type="text"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                placeholder="e.g., neetcode"
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-[#6e7681] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] transition-all text-base"
                required
              />
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="flex-1 h-px bg-[#30363d]"></div>
              <span className="px-4 text-xl font-bold text-[#8b949e]">
                VS
              </span>
              <div className="flex-1 h-px bg-[#30363d]"></div>
            </div>

            <div className="space-y-2">
              <label htmlFor="user2" className="block text-sm font-medium text-[#c9d1d9]">
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#1f6feb] rounded flex items-center justify-center text-white font-semibold text-sm">
                    2
                  </span>
                  Second Username
                </span>
              </label>
              <input
                id="user2"
                type="text"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                placeholder="e.g., hikaru"
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-[#6e7681] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] transition-all text-base"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!user1 || !user2 || loading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-3 px-8 rounded-md font-medium text-base transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#238636]"
            >
              {loading ? 'Comparing...' : 'Compare Profiles'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
