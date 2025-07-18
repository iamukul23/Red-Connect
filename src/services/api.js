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
  create: (donor) => {
    // Get user's IP address and add it to the donor data
    return api.post('/donors', {
      ...donor,
      // IP will be captured on the backend, but we can also send client info
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  },
  search: (params) => api.get('/donors/search', { params }),
  delete: (id) => api.delete(`/admin/donors/${id}`),
  updateAvailability: (id, isAvailable) => api.put(`/admin/donors/${id}`, { is_available: isAvailable }),
};

export const bloodRequestsAPI = {
  getAll: () => api.get('/admin/blood-requests'),
  create: (request) => {
    return api.post('/blood-requests', {
      ...request,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  },
  updateStatus: (id, status) => api.put(`/admin/blood-requests/${id}`, { status }),
};

export const messagesAPI = {
  getAll: () => api.get('/admin/contact-messages'),
  create: (message) => api.post('/contact', message),
  markAsRead: (id) => api.put(`/admin/contact-messages/${id}`, { is_read: true }),
  delete: (id) => api.delete(`/admin/contact-messages/${id}`),
};

export const reportsAPI = {
  getReportData: (period) => api.get(`/admin/reports?period=${period}`),
  exportReport: (format, period) => api.get(`/admin/reports/export?format=${format}&period=${period}`, {
    responseType: 'blob'
  }),
};

export const contactAPI = {
  getAll: () => api.get('/admin/contact-messages'),
  create: (message) => {
    return api.post('/contact', {
      ...message,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  },
};

export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard'),
};

export const bloodGroupsAPI = {
  getAll: () => api.get('/blood-groups'),
};

export default api;
