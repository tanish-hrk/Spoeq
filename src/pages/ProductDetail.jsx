import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useCartStore } from '../lib/store';

export default function ProductDetail(){
  const { id } = useParams();
  const qc = useQueryClient();
  const setCart = useCartStore(s=>s.setCart);
  const { data, isLoading, error } = useQuery({ queryKey: ['product', id], queryFn: async()=> (await api.get('/products/'+id)).data });
  const addMut = useMutation({ mutationFn: async ()=> (await api.post('/cart',{ productId: id, qty:1 })).data, onSuccess: (cart)=> setCart(cart) });
  if(isLoading) return <div className='p-10 text-center text-neutral-500 animate-pulse'>Loading...</div>;
  if(error) return <div className='p-10 text-center text-red-400'>Not found</div>;
  const p = data;
  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Link to='/products' className='text-sm text-neutral-400 hover:text-white'>&larr; Back</Link>
      <div className='grid md:grid-cols-2 gap-10 mt-6'>
        <div className='bg-neutral-900 rounded-xl aspect-square flex items-center justify-center text-neutral-600'>IMG</div>
        <div>
          <h1 className='text-3xl font-bold mb-2'>{p.name}</h1>
          <div className='flex items-baseline gap-3 mb-4'>
            <span className='text-2xl font-semibold'>₹{p.price.sale}</span>
            {p.price.mrp && <span className='text-sm line-through text-neutral-500'>₹{p.price.mrp}</span>}
          </div>
          {p.ratingCount>0 && <div className='text-sm text-amber-400 mb-4'>★ {p.ratingAvg.toFixed(1)} ({p.ratingCount})</div>}
          <p className='text-neutral-300 text-sm leading-relaxed mb-6'>{p.description||'No description yet.'}</p>
          <button onClick={()=> addMut.mutate()} disabled={addMut.isPending} className='px-5 py-3 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50'>
            {addMut.isPending? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
