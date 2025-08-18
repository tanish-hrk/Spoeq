import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function Orders(){
  const { data, isLoading, error } = useQuery({ queryKey: ['orders'], queryFn: async ()=> (await api.get('/orders')).data });
  if(isLoading) return <div className='p-6 text-neutral-400'>Loading orders...</div>;
  if(error) return <div className='p-6 text-red-400 text-sm'>Failed to load orders.</div>;
  const orders = data || [];
  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 gradient-text'>Orders</h1>
      {orders.length===0 && <div className='text-neutral-500 text-sm'>No orders yet.</div>}
      <div className='space-y-4'>
        {orders.map(o=> (
          <Link key={o._id} to={'/orders/'+o._id} className='block bg-neutral-900/70 border border-neutral-800 hover:border-neutral-600 rounded-lg p-4 transition'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <div className='font-semibold text-white text-sm'>#{o._id.slice(-6)}</div>
                <div className='text-xs text-neutral-500'>{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className='flex items-center gap-6 text-sm'>
                <div className='text-neutral-300'>{o.items.length} item{o.items.length!==1?'s':''}</div>
                <div className='text-white font-semibold'>₹{o.pricing?.grandTotal}</div>
                <div className='text-xs px-2 py-1 rounded bg-neutral-800 border border-neutral-700 uppercase tracking-wide'>{o.status}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
