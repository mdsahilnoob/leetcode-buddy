const API_BASE_URL = 'https://leetcode-buddy-z74p.vercel.app';
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

export interface UserStats {
  username: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
}

type ChromeStorageLike = {
  storage?: {
    local?: {
      get: (key: string) => Promise<{ token?: string }>;
    };
  };
};

const getToken = async (): Promise<string | null> => {
  const chromeApi = (globalThis as { chrome?: ChromeStorageLike }).chrome;

  if (chromeApi?.storage?.local?.get) {
    const result = await chromeApi.storage.local.get('token');
    return result.token || null;
  }

  return localStorage.getItem('token');
};

const profileCache = new Map<string, { data: UserStats; expiresAt: number }>();
const inFlightProfileRequests = new Map<string, Promise<UserStats>>();

export const profileAPI = {
  getProfile: async (username: string): Promise<UserStats> => {
    const key = username.trim().toLowerCase();
    const now = Date.now();
    const cached = profileCache.get(key);

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const existingRequest = inFlightProfileRequests.get(key);
    if (existingRequest) {
      return existingRequest;
    }

    const request = (async () => {
      const response = await fetch(`${API_BASE_URL}/api/profile/${encodeURIComponent(username)}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = (await response.json()) as UserStats;
      profileCache.set(key, { data, expiresAt: Date.now() + PROFILE_CACHE_TTL_MS });
      return data;
    })();

    inFlightProfileRequests.set(key, request);

    try {
      return await request;
    } finally {
      inFlightProfileRequests.delete(key);
    }
  },
  clearProfileCache: () => {
    profileCache.clear();
    inFlightProfileRequests.clear();
  },
  prefetchProfiles: async (usernames: string[]): Promise<void> => {
    await Promise.all(usernames.map((username) => profileAPI.getProfile(username)));
  },
};

export const compareAPI = {
  compare: async (username1: string, username2: string) => {
    const token = await getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/api/compare`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username1, username2 }),
    });

    if (!response.ok) throw new Error('Failed to compare profiles');
    return response.json();
  },
};

export const chartAPI = {
  getChartData: async (user1: string, user2: string) => {
    const token = await getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/chart-data?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`,
      { headers }
    );

    if (!response.ok) throw new Error('Failed to fetch chart data');
    return response.json();
  },
};

export const historyAPI = {
  getHistory: async () => {
    const token = await getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/api/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  saveToHistory: async (user1: string, user2: string) => {
    const token = await getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/api/history`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user1, user2 }),
    });

    if (!response.ok) throw new Error('Failed to save to history');
    return response.json();
  },

  deleteFromHistory: async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/api/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete from history');
    return response.json();
  },

  clearHistory: async () => {
    const token = await getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/api/history`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to clear history');
    return response.json();
  },
};
