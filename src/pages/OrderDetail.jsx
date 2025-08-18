import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const statusSteps = ['pending','paid','processing','shipped','delivered'];

export default function OrderDetail(){
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: order, isLoading, error } = useQuery({ queryKey: ['order', id], queryFn: async ()=> (await api.get('/orders/'+id)).data });
  const cancelMutation = useMutation({
    mutationFn: async ()=> (await api.post(`/orders/${id}/cancel`)).data,
    onSuccess: (data)=> { qc.setQueryData(['order', id], data); }
  });
  if(isLoading) return <div className='p-6 text-neutral-400'>Loading...</div>;
  if(error || !order) return <div className='p-6 text-red-400 text-sm'>Order not found.</div>;
  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
        <h1 className='text-2xl font-bold gradient-text'>Order #{order._id.slice(-6)}</h1>
        <div className='flex items-center gap-3'>
          <div className='text-xs px-2 py-1 rounded bg-neutral-800 border border-neutral-700 uppercase tracking-wide'>{order.status}</div>
          {order.status==='pending' && <button onClick={()=> cancelMutation.mutate()} disabled={cancelMutation.isLoading} className='text-[11px] px-3 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-red-300 disabled:opacity-50'>Cancel</button>}
        </div>
      </div>
      <StatusTimeline status={order.status} />
      <div className='mt-8 grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2 space-y-4'>
          {order.items.map((it,i)=> (
            <div key={i} className='flex items-center justify-between bg-neutral-900/70 border border-neutral-800 rounded-lg p-3'>
              <div>
                <div className='text-sm font-medium text-white'>{it.nameSnapshot||'Product'}</div>
                <div className='text-xs text-neutral-500'>{it.qty} × ₹{it.unitPrice}</div>
              </div>
              <div className='text-sm font-semibold text-white'>₹{it.subtotal}</div>
            </div>
          ))}
        </div>
        <div className='space-y-3 bg-neutral-900/70 border border-neutral-800 rounded-lg p-4 h-fit'>
          <h2 className='font-semibold text-white text-sm mb-2'>Summary</h2>
          <Row label='Subtotal' value={order.pricing?.subtotal} />
          {order.pricing?.discountTotal>0 && <Row label='Discount' value={'- '+order.pricing.discountTotal} />}
          <Row label='Shipping' value={order.pricing?.shipping||0} />
          <Row label='Tax' value={order.pricing?.tax||0} />
          <div className='border-t border-neutral-800 pt-2'>
            <Row label='Grand Total' value={order.pricing?.grandTotal} strong />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }){
  return (
    <div className='flex items-center justify-between text-xs'>
      <span className='text-neutral-400'>{label}</span>
      <span className={'text-neutral-200 '+(strong?'font-semibold text-white text-sm':'')}>₹{value}</span>
    </div>
  );
}

function StatusTimeline({ status }){
  const currentIdx = statusSteps.indexOf(status);
  return (
    <div className='flex items-center gap-3 overflow-x-auto pb-2'>
      {statusSteps.map((s,i)=> {
        const active = i <= currentIdx;
        return (
          <div key={s} className='flex items-center gap-3'>
            <div className={'h-8 px-3 rounded-full text-xs flex items-center border '+(active? 'bg-neon-pink/20 border-neon-pink text-white':'bg-neutral-800 border-neutral-700 text-neutral-500')}>{s}</div>
            {i < statusSteps.length-1 && <div className={'w-10 h-px '+(i<currentIdx? 'bg-neon-pink':'bg-neutral-700')}></div>}
          </div>
        );
      })}
    </div>
  );
}
