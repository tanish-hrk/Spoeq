import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('adm-token', data?.tokens?.access)
      localStorage.setItem('adm-refresh', data?.tokens?.refresh)
      nav('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full grid place-items-center p-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <label className="block text-sm mb-2">Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />

        <label className="block text-sm mt-4 mb-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

        <button disabled={loading} className="btn btn-primary mt-6 w-full">{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  )
}
