import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function ProductList(){
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products?limit=24')).data
  });
  if(isLoading) return <div className='p-10 text-center text-neutral-500 animate-pulse'>Loading drops...</div>;
  if(error) return <div className='p-10 text-center text-red-400'>Error loading products</div>;
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Fresh Gear</h1>
        <a href='/cart' className='text-sm hover:underline'>Cart</a>
      </div>
      <div className='grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {data.items.map(p=> (
          <Link key={p._id} to={'/products/'+p._id} className='group bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-neutral-600 transition flex flex-col'>
            <div className='aspect-square mb-3 bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-sm'>IMG</div>
            <div className='font-medium group-hover:text-white text-neutral-200 line-clamp-2'>{p.name}</div>
            <div className='mt-auto flex items-baseline gap-2'>
              <span className='text-lg font-semibold text-white'>₹{p.price.sale}</span>
              {p.price.mrp && <span className='text-xs line-through text-neutral-500'>₹{p.price.mrp}</span>}
            </div>
            {p.ratingCount>0 && <div className='text-xs text-amber-400 mt-1'>★ {p.ratingAvg.toFixed(1)} ({p.ratingCount})</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
