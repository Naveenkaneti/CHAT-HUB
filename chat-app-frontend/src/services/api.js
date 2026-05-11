import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/register', data), // Changed from /signup
  getMe: () => api.get('/auth/me'),
  searchUsers: (search) => api.get(`/auth?search=${search}`),
  // Admin
  getAllUsers: () => api.get('/auth/all'),
  deleteUser: (id) => api.delete(`/auth/${id}`)
};

export const chatAPI = {
  getChats: () => api.get('/chat'), // Changed from /chats
  accessChat: (userId) => api.post('/chat', { userId }),
  createGroup: (groupData) => api.post('/chat/group', groupData),
  getMessages: (chatId) => api.get(`/message/${chatId}`), // Changed from /messages
  sendMessage: (chatId, content) => api.post(`/message`, { chatId, content }) // Changed structure
};

export default api;
