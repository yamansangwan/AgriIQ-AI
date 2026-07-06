import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const analyzeCrop = async (formData: FormData) => {
  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getReport = async (id: string) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const simulateScenario = async (reportId: string, scenario: string) => {
  const response = await api.post('/simulate', { reportId, scenario });
  return response.data;
};
