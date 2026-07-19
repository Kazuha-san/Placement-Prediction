const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = {
  predict: async (profileData) => {
    // Note: To support timeouts, we'll implement it in the component or via AbortController here
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Wait up to 10s for the network, though NFR specifies 2s for backend response.

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        signal: controller.signal,
        credentials: 'include'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('service unavailable, please try again');
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw new Error('service unavailable, please try again');
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("couldn't load history, please try again");
      }

      return await response.json();
    } catch (error) {
      throw new Error("couldn't load history, please try again");
    }
  },

  getProgress: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("couldn't load progress, please try again");
      }
      return await response.json();
    } catch (error) {
      throw new Error("couldn't load progress, please try again");
    }
  }
};
