import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
};

export const donorsAPI = {
  getAll: () => api.get('/admin/donors'),
  create: (donor) => api.post('/donors', donor),
  search: (params) => api.get('/donors/search', { params }),
};

export const bloodRequestsAPI = {
  getAll: () => api.get('/admin/blood-requests'),
  create: (request) => api.post('/blood-requests', request),
  updateStatus: (id, status) => api.put(`/admin/blood-requests/${id}`, { status }),
};

export const contactAPI = {
  getAll: () => api.get('/admin/contact-messages'),
  create: (message) => api.post('/contact', message),
};

export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard'),
};

export const bloodGroupsAPI = {
  getAll: () => api.get('/blood-groups'),
};

export default api;
