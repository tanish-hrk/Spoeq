/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultCats = [
  { key: 'fitness', label: 'Fitness' },
  { key: 'running', label: 'Running' },
  { key: 'training', label: 'Training' },
  { key: 'team', label: 'Team Sports' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'outdoor', label: 'Outdoor' }
];

export default function CategoryRail({ categories = defaultCats }){
  const listRef = React.useRef(null);
  const scroll = (dir)=>{
    const el = listRef.current; if(!el) return;
    const delta = (el.clientWidth ?? 800) * 0.85 * (dir==='right'? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };
  return (
    <section className='relative max-w-7xl mx-auto px-4 sm:px-6 my-4'>
      <button aria-label='Previous categories' onClick={()=>scroll('left')}
        className='hidden sm:flex absolute -left-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow border border-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:border-neutral-700'>
        <ChevronLeft size={16} />
      </button>
      <button aria-label='Next categories' onClick={()=>scroll('right')}
        className='hidden sm:flex absolute -right-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow border border-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:border-neutral-700'>
        <ChevronRight size={16} />
      </button>
      <div ref={listRef} className='overflow-x-auto no-scrollbar scroll-smooth'>
        <div className='flex gap-3 pr-3'>
          {categories.map(c=> (
            <Link key={c.key} to={'/products?q='+c.key}
              className='shrink-0 min-w-[140px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 hover:shadow transition flex items-center justify-center text-sm font-medium'>
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
