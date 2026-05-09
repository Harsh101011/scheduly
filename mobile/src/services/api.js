import axios from 'axios';

// ✅ Your machine's local IP (auto-detected: 192.168.31.155)
// Both Android and iOS physical devices use this IP to reach your PC's backend
// Make sure your phone and PC are on the same Wi-Fi network
const BASE_IP = '192.168.31.155';
export const API_BASE_URL = `http://${BASE_IP}:5000/api`;
export const SOCKET_URL = `http://${BASE_IP}:5000`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const fetchExperts = ({ page = 1, limit = 10, category, search } = {}) => {
  const params = { page, limit };
  if (category && category !== 'All') params.category = category;
  if (search) params.search = search;
  return api.get('/experts', { params });
};

export const fetchExpertById = (id) => api.get(`/experts/${id}`);

export const createBooking = (data) => api.post('/bookings', data);

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });

export const fetchMyBookings = (email) =>
  api.get('/bookings', { params: { email } });

export default api;
