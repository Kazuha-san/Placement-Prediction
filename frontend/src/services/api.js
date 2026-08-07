const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const MOCK_HISTORY = [
  { id: 'mock-5', created_at: '2025-06-02T10:15:00Z', outcome: true, confidence_score: 0.88, cgpa: 8.7, internships: 2, projects: 5, certifications: 3, aptitude_score: 82, soft_skills_rating: 8, extracurricular_activities: true, placement_training: true, backlogs: 0, limiting_features: {} },
  { id: 'mock-4', created_at: '2025-05-10T14:30:00Z', outcome: true, confidence_score: 0.74, cgpa: 8.1, internships: 1, projects: 4, certifications: 2, aptitude_score: 71, soft_skills_rating: 7, extracurricular_activities: true, placement_training: true, backlogs: 0, limiting_features: { aptitude_score: 'slightly below peer average' } },
  { id: 'mock-3', created_at: '2025-04-18T09:00:00Z', outcome: false, confidence_score: 0.52, cgpa: 7.4, internships: 0, projects: 2, certifications: 1, aptitude_score: 58, soft_skills_rating: 6, extracurricular_activities: false, placement_training: true, backlogs: 1, limiting_features: { internships: 'no internships completed yet', backlogs: '1 active backlog' } },
  { id: 'mock-2', created_at: '2025-03-22T16:45:00Z', outcome: false, confidence_score: 0.41, cgpa: 6.9, internships: 0, projects: 1, certifications: 0, aptitude_score: 49, soft_skills_rating: 5, extracurricular_activities: false, placement_training: false, backlogs: 2, limiting_features: { cgpa: 'below placement threshold', placement_training: 'not yet completed' } },
  { id: 'mock-1', created_at: '2025-02-05T11:20:00Z', outcome: false, confidence_score: 0.33, cgpa: 6.5, internships: 0, projects: 1, certifications: 0, aptitude_score: 44, soft_skills_rating: 5, extracurricular_activities: false, placement_training: false, backlogs: 2, limiting_features: { cgpa: 'below placement threshold' } },
];

export const api = {
  predict: async (profileData) => {
    // Note: To support timeouts, we'll implement it in the component or via AbortController here
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Wait up to 10s for the network, though NFR specifies 2s for backend response.

    try {
      const response = await fetch(`${API_BASE_URL}/predict/`, {
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
      const response = await fetch(`${API_BASE_URL}/history/`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("couldn't load history, please try again");
      }

      return await response.json();
    } catch (error) {
      if (import.meta.env.DEV) return MOCK_HISTORY;
      throw new Error("couldn't load history, please try again");
    }
  },

  getProgress: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("couldn't load progress, please try again");
      }
      return await response.json();
    } catch (error) {
      if (import.meta.env.DEV) return MOCK_HISTORY;
      throw new Error("couldn't load progress, please try again");
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const result = await response.json();
      return result.user;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  deleteAccount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      const result = await response.json();
      return result.success;
    } catch (error) {
      throw new Error('Failed to delete account');
    }
  }
};
