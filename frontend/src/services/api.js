const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleJson(response, fallbackMessage) {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }
  return response.json();
}

export const api = {
  predict: async (profileData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        signal: controller.signal,
        credentials: 'include',
      });
      return await handleJson(response, 'service unavailable, please try again');
    } catch (error) {
      throw new Error(error.message || 'service unavailable, please try again');
    } finally {
      clearTimeout(timeoutId);
    }
  },

  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/history/`, { credentials: 'include' });
    return handleJson(response, "couldn't load history, please try again");
  },

  getProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/progress/`, { credentials: 'include' });
    return handleJson(response, "couldn't load progress, please try again");
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await handleJson(response, 'Failed to update profile');
    return result.user;
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const result = await handleJson(response, 'Failed to delete account');
    return result.success;
  },

  // Logs the caller in as the seeded reviewer/demo account - no real Google
  // login needed. Used by the "Demo account" link on the sign-in page.
  loginDemo: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/demo`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleJson(response, 'Could not start demo session, please try again');
  },
};
