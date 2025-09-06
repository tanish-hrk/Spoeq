import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://spoeq-server.vercel.app',
  withCredentials: false,
})

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('adm-token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(r=>r, async (err) => {
  const original = err.config
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true
    try {
      const rt = localStorage.getItem('adm-refresh')
      if (!rt) throw err
      const { data } = await api.post('/auth/refresh', { refreshToken: rt })
      localStorage.setItem('adm-token', data.tokens.access)
      localStorage.setItem('adm-refresh', data.tokens.refresh)
      return api(original)
    } catch {
      localStorage.removeItem('adm-token')
      localStorage.removeItem('adm-refresh')
      if (typeof window !== 'undefined') window.location.href = '/login'
    }
  }
  return Promise.reject(err)
})

export default api
