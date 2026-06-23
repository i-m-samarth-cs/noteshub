import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://noteshub-production-2030.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const notesAPI = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  upload: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/notes`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  download: (id) => api.get(`/notes/${id}/download`, {
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    }
  }),
  incrementDownload: (id) => api.post(`/notes/${id}/increment-download`),
  delete: (id) => api.delete(`/notes/${id}`),
  getUserNotes: () => api.get('/notes/user/me'),
};

export const paymentsAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPurchases: () => api.get('/payments/purchases'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getNotes: () => api.get('/admin/notes'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteNote: (id) => api.delete(`/admin/notes/${id}`),
};

export default api; 