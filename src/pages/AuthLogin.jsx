import React, { useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../lib/store';
import { useToast } from '../components/ui/ToastProvider';
import { useEffect } from 'react';

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
  const toast = useToast();
  useEffect(()=> { if(error) toast?.push(error,{ type:'error'}); }, [error, toast]);
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='glass w-full max-w-md rounded-2xl p-8 space-y-6 shadow-glow'>
        <h1 className='text-3xl font-bold tracking-tight gradient-text'>Welcome back 👋</h1>
        <form onSubmit={submit} className='space-y-4'>
          <input className='field' placeholder='Email' type='email' value={email} onChange={e=>setEmail(e.target.value)} />
          <input className='field' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={loading} className='btn btn-gradient w-full'>{loading? 'Logging in...' : 'Login'}</button>
        </form>
        <p className='text-sm text-neutral-400'>No account? <a href='/register' className='text-neon-pink hover:underline'>Register</a></p>
      </div>
    </div>
  );
}
