const API_BASE_URL = 'https://leetcode-buddy-z74p.vercel.app';

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

export const profileAPI = {
  getProfile: async (username: string) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/${username}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
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

  // Save comparison to history (requires auth)
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

  // Delete comparison from history (requires auth)
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

  // Clear all history (requires auth)
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

// Example usage in components:

/*
// Login component
import { authAPI } from './api/service';

const handleLogin = async () => {
  try {
    const { token, user } = await authAPI.loginWithGoogle();
    console.log('Logged in:', user);
    // Navigate to next page
  } catch (error) {
    console.error('Login failed:', error);
  }
};
};
*/
