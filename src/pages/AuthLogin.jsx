import React, { useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../lib/store';

export default function AuthLogin(){
  const setUser = useAuthStore(s=>s.setUser);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  async function submit(e){
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await api.post('/auth/login',{ email,password });
      localStorage.setItem('accessToken', res.data.tokens.access);
      localStorage.setItem('refreshToken', res.data.tokens.refresh);
      setUser(res.data.user);
      window.location.href='/products';
    } catch(e){ setError(e.response?.data?.error||e.message); } finally { setLoading(false); }
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white px-4'>
      <h1 className='text-3xl font-bold mb-6 tracking-tight'>Welcome back 👋</h1>
      <form onSubmit={submit} className='w-full max-w-sm space-y-4'>
        <input className='w-full p-3 rounded bg-neutral-800 focus:outline-none' placeholder='Email' type='email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='w-full p-3 rounded bg-neutral-800 focus:outline-none' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className='text-red-400 text-sm'>{error}</div>}
        <button disabled={loading} className='w-full py-3 rounded bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50'>{loading? 'Logging in...' : 'Login'}</button>
      </form>
      <p className='mt-6 text-sm text-neutral-400'>No account? <a href='/register' className='text-indigo-400 hover:underline'>Register</a></p>
    </div>
  );
}
