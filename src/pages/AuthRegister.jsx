import React, { useState } from 'react';
import api from '../lib/api';

export default function AuthRegister(){
  const [form,setForm]=useState({ email:'', password:'', name:'' });
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  async function submit(e){
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('accessToken', res.data.tokens.access);
      localStorage.setItem('refreshToken', res.data.tokens.refresh);
      window.location.href='/products';
    } catch(e){ setError(e.response?.data?.error||e.message); } finally { setLoading(false); }
  }
  function update(k,v){ setForm(f=>({...f,[k]:v})); }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white px-4'>
      <h1 className='text-3xl font-bold mb-6'>Create your vibe ✨</h1>
      <form onSubmit={submit} className='w-full max-w-sm space-y-4'>
        <input className='w-full p-3 rounded bg-neutral-800' placeholder='Name' value={form.name} onChange={e=>update('name',e.target.value)} />
        <input className='w-full p-3 rounded bg-neutral-800' placeholder='Email' type='email' value={form.email} onChange={e=>update('email',e.target.value)} />
        <input className='w-full p-3 rounded bg-neutral-800' placeholder='Password' type='password' value={form.password} onChange={e=>update('password',e.target.value)} />
        {error && <div className='text-red-400 text-sm'>{error}</div>}
        <button disabled={loading} className='w-full py-3 rounded bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50'>{loading? 'Creating...' : 'Register'}</button>
      </form>
      <p className='mt-6 text-sm text-neutral-400'>Already vibing? <a href='/login' className='text-emerald-400 hover:underline'>Login</a></p>
    </div>
  );
}
