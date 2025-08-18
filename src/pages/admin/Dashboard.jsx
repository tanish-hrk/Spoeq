import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Link, useSearchParams } from 'react-router-dom';

export default function AdminDashboard(){
  const [sp,setSp] = useSearchParams();
  const page = sp.get('page')||'1';
  const status = sp.get('status')||'';
  const qs = new URLSearchParams({ page, ...(status? { status }: {}) }).toString();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey:['adminOrders', qs], queryFn: async ()=> (await api.get('/orders/admin/all?'+qs)).data });
  const advanceMutation = useMutation({ mutationFn: async (id)=> (await api.post('/orders/'+id+'/advance')).data, onSuccess: ()=> qc.invalidateQueries({ queryKey:['adminOrders'] }) });
  const refundMutation = useMutation({ mutationFn: async (id)=> (await api.post('/orders/'+id+'/refund')).data, onSuccess: ()=> qc.invalidateQueries({ queryKey:['adminOrders'] }) });
  if(isLoading) return <div className='p-6 text-neutral-400'>Loading dashboard...</div>;
  if(error) return <div className='p-6 text-red-400 text-sm'>Failed to load.</div>;
  const setParam = (k,v)=> { const next = new URLSearchParams(sp); if(v) next.set(k,v); else next.delete(k); setSp(next,{ replace:true }); };
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold gradient-text mb-6'>Admin Dashboard</h1>
      <div className='flex flex-wrap gap-2 mb-6 text-[11px]'>
        <button onClick={()=> setParam('status','')} className={'px-3 py-1 rounded border '+(!status? 'bg-neon-pink/20 border-neon-pink text-white':'bg-neutral-900 border-neutral-800 text-neutral-300')}>All</button>
        {data.statusCounts.map(sc=> (
          <button key={sc._id} onClick={()=> setParam('status', sc._id)} className={'px-3 py-1 rounded border '+(status===sc._id? 'bg-neon-pink/20 border-neon-pink text-white':'bg-neutral-900 border-neutral-800 text-neutral-300')}>{sc._id} ({sc.count})</button>
        ))}
      </div>
      <div className='overflow-x-auto rounded-lg border border-neutral-800'>
        <table className='min-w-full text-xs'>
          <thead className='bg-neutral-900/60 text-neutral-400'>
            <tr>
              <th className='text-left p-2 font-medium'>Order</th>
              <th className='text-left p-2 font-medium'>User</th>
              <th className='text-left p-2 font-medium'>Items</th>
              <th className='text-left p-2 font-medium'>Total</th>
              <th className='text-left p-2 font-medium'>Status</th>
              <th className='text-left p-2 font-medium'>Created</th>
              <th className='text-left p-2 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(o=> (
              <tr key={o._id} className='border-t border-neutral-800 hover:bg-neutral-900/50'>
                <td className='p-2'><Link to={'/orders/'+o._id} className='text-neon-pink hover:underline'>#{o._id.slice(-6)}</Link></td>
                <td className='p-2'>{o.userId}</td>
                <td className='p-2'>{o.items.length}</td>
                <td className='p-2 font-semibold text-white'>₹{o.pricing?.grandTotal}</td>
                <td className='p-2 uppercase'>{o.status}</td>
                <td className='p-2'>{new Date(o.createdAt).toLocaleString()}</td>
                <td className='p-2 space-x-1'>
                  {['paid','processing','shipped'].includes(o.status) && <button onClick={()=> advanceMutation.mutate(o._id)} className='text-[10px] px-2 py-1 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500'>Advance</button>}
                  {['paid','delivered'].includes(o.status) && <button onClick={()=> refundMutation.mutate(o._id)} className='text-[10px] px-2 py-1 rounded bg-neutral-800 border border-red-600 hover:border-red-400 text-red-300'>Refund</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex gap-2 mt-4'>
        {Array.from({ length: data.totalPages }).map((_,i)=> (
          <button key={i} onClick={()=> setParam('page', (i+1).toString())} className={'px-2 py-1 rounded text-[11px] border '+(page===(i+1).toString()? 'bg-neon-pink/20 border-neon-pink text-white':'bg-neutral-900 border-neutral-800 text-neutral-400')}>{i+1}</button>
        ))}
      </div>
    </div>
  );
}
