import React, { useState } from 'react';
import api from '../lib/api';
import { useToast } from '../components/ui/ToastProvider';
import { useEffect } from 'react';

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
  const toast = useToast();
  useEffect(()=> { if(error) toast?.push(error,{ type:'error'}); }, [error, toast]);
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='glass w-full max-w-md rounded-2xl p-8 space-y-6 shadow-glow'>
        <h1 className='text-3xl font-bold gradient-text'>Create your vibe ✨</h1>
        <form onSubmit={submit} className='space-y-4'>
          <input className='field' placeholder='Name' value={form.name} onChange={e=>update('name',e.target.value)} />
          <input className='field' placeholder='Email' type='email' value={form.email} onChange={e=>update('email',e.target.value)} />
          <input className='field' placeholder='Password' type='password' value={form.password} onChange={e=>update('password',e.target.value)} />
          <button disabled={loading} className='btn btn-gradient w-full'>{loading? 'Creating...' : 'Register'}</button>
        </form>
        <p className='text-sm text-neutral-400'>Already vibing? <a href='/login' className='text-neon-pink hover:underline'>Login</a></p>
      </div>
    </div>
  );
}
