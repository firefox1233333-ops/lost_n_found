const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Items API
export const itemsAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/items${queryParams ? `?${queryParams}` : ''}`);
  },

  getOne: (id) => apiRequest(`/items/${id}`),

  create: (itemData) =>
    apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  updateStatus: (id, status) =>
    apiRequest(`/items/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id) =>
    apiRequest(`/items/${id}`, {
      method: 'DELETE',
    }),
};



