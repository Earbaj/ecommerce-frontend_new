import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // আপনার NestJS সার্ভারের URL
});

// প্রতিটি রিকোয়েস্টে অটোমেটিক টোকেন পাঠানোর জন্য ইন্টারসেপ্টর
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;