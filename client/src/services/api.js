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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle connection errors
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network/connection errors
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
    }
    throw error;
  }
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

  /** Items reported by the logged-in user only (requires auth) */
  getMyReports: () => apiRequest('/items/my-reports'),

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
  claim: (id) =>
    apiRequest(`/items/${id}/claim`, {
      method: 'POST',
    }),
};

// Users API (admin only)
export const usersAPI = {
  getAll: () =>
    apiRequest('/users', {
      method: 'GET',
    }),

  updateRole: (id, role) =>
    apiRequest(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
};



