import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000, // Generous timeout for complex AI generation
});

export const caseApi = {
  // 9.1 Generate Mystery
  createCase: async ({ premise, difficulty }) => {
    const res = await api.post('/cases', { premise, difficulty });
    return res.data;
  },

  // 9.2 Retrieve Mystery
  getCase: async (id) => {
    const res = await api.get(`/cases/${id}`);
    return res.data;
  },

  // 9.3 Discover Clue
  discoverClue: async (caseId, clueId) => {
    const res = await api.post(`/cases/${caseId}/clues/${clueId}/discover`);
    return res.data;
  },

  // 9.4 Request Hint
  requestHint: async (caseId) => {
    const res = await api.post(`/cases/${caseId}/hints`);
    return res.data;
  },

  // 9.5 Submit Accusation
  submitAccusation: async (caseId, suspectId) => {
    const res = await api.post(`/cases/${caseId}/accuse`, { suspectId });
    return res.data;
  },

  // 9.6 Retrieve Result
  getCaseResult: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/result`);
    return res.data;
  },
};

export default api;
