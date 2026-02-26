import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || '/api/v1/auth';

// ── Axios instance ──────────────────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL });
const authApi = axios.create({ baseURL: AUTH_URL });

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await authApi.post('/token/refresh/', { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────────────────────
export const authService = {
  login: (email, password) => authApi.post('/login/', { email, password }),
  logout: (refresh) => api.post('/auth/users/logout/', { refresh }),
  refreshToken: (refresh) => authApi.post('/token/refresh/', { refresh }),
  getMe: () => api.get('/auth/users/me/'),
  updateMe: (data) => api.patch('/auth/users/me/', data),
  changePassword: (data) => api.post('/auth/users/change_password/', data),
};

// ── Services ────────────────────────────────────────────────────────────────
export const servicesService = {
  list: (params) => api.get('/services/', { params }),
  get: (slug) => api.get(`/services/${slug}/`),
  create: (data) => api.post('/services/', data),
  update: (slug, data) => api.patch(`/services/${slug}/`, data),
  delete: (slug) => api.delete(`/services/${slug}/`),
};

// ── Inquiries ────────────────────────────────────────────────────────────────
export const inquiryService = {
  submit: (data) => api.post('/inquiries/', data),          // public
  list: (params) => api.get('/inquiries/', { params }),     // staff
  get: (id) => api.get(`/inquiries/${id}/`),
  updateStatus: (id, status) => api.patch(`/inquiries/${id}/update_status/`, { status }),
  update: (id, data) => api.patch(`/inquiries/${id}/`, data),
};

// ── Contact ────────────────────────────────────────────────────────────────
export const contactService = {
  submit: (data) => api.post('/contact/', data),            // public
  list: (params) => api.get('/contact/', { params }),       // staff
  markRead: (id) => api.patch(`/contact/${id}/mark_read/`),
};

// ── Jobs / Careers ─────────────────────────────────────────────────────────
export const jobsService = {
  list: (params) => api.get('/jobs/', { params }),          // public
  get: (id) => api.get(`/jobs/${id}/`),
  create: (data) => api.post('/jobs/', data),               // manager+
  update: (id, data) => api.patch(`/jobs/${id}/`, data),
  delete: (id) => api.delete(`/jobs/${id}/`),
};

export const applicationsService = {
  submit: (data) => api.post('/applications/', data, {      // public (multipart)
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list: (params) => api.get('/applications/', { params }),  // manager+
  get: (id) => api.get(`/applications/${id}/`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/`, { status }),
};

// ── FAQs ────────────────────────────────────────────────────────────────────
export const faqService = {
  list: (params) => api.get('/faqs/', { params }),          // public
  create: (data) => api.post('/faqs/', data),               // admin
  update: (id, data) => api.patch(`/faqs/${id}/`, data),
  delete: (id) => api.delete(`/faqs/${id}/`),
};

// ── Testimonials ─────────────────────────────────────────────────────────
export const testimonialService = {
  list: (params) => api.get('/testimonials/', { params }),
};

// ── Team ─────────────────────────────────────────────────────────────────
export const teamService = {
  list: () => api.get('/team/'),
};

// ── Staff Users ──────────────────────────────────────────────────────────
export const staffService = {
  list: () => api.get('/auth/users/'),
  create: (data) => api.post('/auth/users/', data),
  update: (id, data) => api.patch(`/auth/users/${id}/`, data),
  delete: (id) => api.delete(`/auth/users/${id}/`),
};

export default api;