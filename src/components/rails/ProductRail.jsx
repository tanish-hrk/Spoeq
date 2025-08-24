/* eslint-disable react/prop-types */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function ProductRail({ title, query }){
  const qs = new URLSearchParams(query || { limit: 8, sort: '-ratingAvg' }).toString();
  const { data, isLoading } = useQuery({ queryKey: ['rail', qs], queryFn: async ()=> (await api.get('/products?'+qs)).data });
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 my-6'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <Link to={'/products?'+qs} className='text-xs text-eco-leaf hover:underline'>View All</Link>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
        {isLoading && Array.from({ length:6 }).map((_,i)=>(<div key={i} className='h-48 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse' />))}
        {data && data.items.map(p=> (
          <Link to={'/products/'+p._id} key={p._id} className='rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 hover:shadow transition flex flex-col'>
            <div className='aspect-square rounded bg-neutral-100 dark:bg-neutral-800 mb-2 flex items-center justify-center text-xs text-neutral-500'>IMG</div>
            <div className='text-sm font-medium line-clamp-2'>{p.name}</div>
            <div className='mt-auto text-sm font-semibold'>₹{p.price.sale}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
