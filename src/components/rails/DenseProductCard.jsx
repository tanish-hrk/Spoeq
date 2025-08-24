/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function DenseProductCard({ p, wished, onToggleWish }){
  return (
    <div className='group relative bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800 hover:shadow transition flex flex-col overflow-hidden'>
      {onToggleWish && (
        <button onClick={(e)=> { e.preventDefault(); e.stopPropagation(); onToggleWish(); }}
          className={'absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full backdrop-blur bg-white/80 border border-eco-grass/50 text-eco-leaf dark:bg-neutral-800/60 dark:border-neutral-700 '+ (wished? 'ring-2 ring-eco-grass/60':'')}>
          <Heart size={14} className={wished? 'fill-current':''} />
        </button>
      )}
      <Link to={'/products/'+p._id} className='flex flex-col flex-1'>
        <div className='aspect-[4/5] mb-2 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-sm'>IMG</div>
        <div className='font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white line-clamp-2'>{p.name}</div>
        <div className='mt-auto flex items-baseline gap-2'>
          <span className='text-base font-semibold text-eco-leaf'>₹{p.price.sale}</span>
          {p.price.mrp && <span className='text-xs line-through text-neutral-500'>₹{p.price.mrp}</span>}
        </div>
      </Link>
    </div>
  );
}
