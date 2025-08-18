import React, { useState } from 'react';
import api from '../lib/api';

export default function Checkout(){
  const [creating,setCreating]=useState(false);
  const [order,setOrder]=useState(null);
  const [payment,setPayment]=useState(null);
  const [error,setError]=useState(null);

  async function createDraft(){
    setCreating(true); setError(null);
    try { const res = await api.post('/orders'); setOrder(res.data); } catch(e){ setError(e.response?.data?.error||e.message); } finally { setCreating(false); }
  }
  async function createIntent(){
    try { const res = await api.post(`/orders/${order._id}/create-payment-intent`); setPayment(res.data); } catch(e){ setError(e.response?.data?.error||e.message); }
  }
  function simulateVerify(){
    alert('In live mode, Razorpay Checkout opens. After success, backend /orders/verify is called.');
  }
  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>
      <div className='space-y-4'>
        {!order && <button onClick={createDraft} disabled={creating} className='px-5 py-3 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50'>Create Order Draft</button>}
        {order && !payment && <button onClick={createIntent} className='px-5 py-3 rounded bg-emerald-600 hover:bg-emerald-500'>Create Payment Intent</button>}
        {payment && <button onClick={simulateVerify} className='px-5 py-3 rounded bg-pink-600 hover:bg-pink-500'>Pay Now (Demo)</button>}
        {order && <pre className='bg-neutral-900 text-xs p-3 rounded overflow-x-auto'>{JSON.stringify(order,null,2)}</pre>}
        {payment && <pre className='bg-neutral-900 text-xs p-3 rounded overflow-x-auto'>{JSON.stringify(payment,null,2)}</pre>}
        {error && <div className='text-red-400 text-sm'>{error}</div>}
      </div>
    </div>
  );
}
