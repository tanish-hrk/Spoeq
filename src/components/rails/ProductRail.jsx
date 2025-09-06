 
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import DenseProductCard from './DenseProductCard';

export default function ProductRail({ title, query }){
  const qs = new URLSearchParams(query || { limit: 8, sort: '-ratingAvg' }).toString();
  const { data, isLoading } = useQuery({ queryKey: ['rail', qs], queryFn: async ()=> (await api.get('/products?'+qs)).data });
  const listRef = React.useRef(null);
  const scroll = (dir)=>{
    const el = listRef.current; if(!el) return;
    const delta = (el.clientWidth ?? 800) * 0.85 * (dir==='right'? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };
  return (
    <section className='relative max-w-7xl mx-auto px-4 sm:px-6 my-6'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <Link to={'/products?'+qs} className='text-xs text-eco-leaf hover:underline'>View All</Link>
      </div>
      <div className='relative'>
        {/* Prev/Next buttons */}
        <button aria-label='Previous' onClick={()=>scroll('left')}
          className='hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md border border-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:border-neutral-700'>
          <ChevronLeft size={18} />
        </button>
        <button aria-label='Next' onClick={()=>scroll('right')}
          className='hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md border border-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:border-neutral-700'>
          <ChevronRight size={18} />
        </button>

        <div ref={listRef} className='overflow-x-auto no-scrollbar scroll-smooth'>
          <div className='flex gap-4 pr-4'>
            {isLoading && Array.from({ length: 8 }).map((_,i)=>(
              <div key={i} className='min-w-[180px] sm:min-w-[200px] h-[240px] rounded-xl bg-eco-fern/60 dark:bg-neutral-800 animate-pulse border border-eco-grass/30 dark:border-neutral-800' />
            ))}
            {data && data.items.map(p=> (
              <div key={p._id} className='min-w-[180px] sm:min-w-[200px]'>
                <DenseProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
