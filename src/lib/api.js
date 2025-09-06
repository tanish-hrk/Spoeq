import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://spoeq-server.vercel.app'
});

instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if(token) cfg.headers.Authorization = 'Bearer ' + token;
  return cfg;
});

instance.interceptors.response.use(r=>r, async err => {
  const original = err.config;
  if(err.response?.status === 401 && !original._retry){
    original._retry = true;
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if(!refreshToken) throw err;
      const res = await instance.post('/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', res.data.tokens.access);
      return instance(original);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});

export default instance;
