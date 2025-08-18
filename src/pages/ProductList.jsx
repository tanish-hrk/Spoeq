import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

export default function ProductList(){
  const user = useAuthStore(s=> s.user);
  const wishlist = useAuthStore(s=> s.wishlist);
  const toggleWishlistLocal = useAuthStore(s=> s.toggleWishlistLocal);
  const [sp,setSp] = useSearchParams();
  const qSearch = sp.get('q')||'';
  const qSort = sp.get('sort')||'';
  const qMin = sp.get('min')||'';
  const qMax = sp.get('max')||'';
  const queryStr = new URLSearchParams({
    ...(qSearch? { search: qSearch }: {}),
    ...(qSort? { sort: qSort }: {}),
    ...(qMin? { minPrice: qMin }: {}),
    ...(qMax? { maxPrice: qMax }: {}),
    limit: '24'
  }).toString();
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryStr],
    queryFn: async () => (await api.get('/products?'+queryStr)).data
  });
  const setParam = (k,v)=> { const next = new URLSearchParams(sp); if(v) next.set(k,v); else next.delete(k); setSp(next,{ replace: true }); };
  if(isLoading) return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='h-9 w-40 mb-6 rounded bg-neutral-800 animate-pulse'></div>
      <div className='grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length:8 }).map((_,i)=>(
          <div key={i} className='rounded-xl p-4 border border-neutral-800 bg-neutral-900 animate-pulse h-64'></div>
        ))}
      </div>
    </div>
  );
  if(error) return <div className='p-10 text-center text-red-400'>Error loading products</div>;
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6'>
        <h1 className='text-3xl font-bold tracking-tight gradient-text'>Fresh Gear</h1>
        <div className='flex flex-wrap gap-3 items-center'>
          <input className='field w-48' placeholder='Search' value={qSearch} onChange={e=> setParam('q', e.target.value)} />
          <input className='field w-24' placeholder='Min ₹' value={qMin} onChange={e=> setParam('min', e.target.value)} />
            <input className='field w-24' placeholder='Max ₹' value={qMax} onChange={e=> setParam('max', e.target.value)} />
          <select className='field w-40' value={qSort} onChange={e=> setParam('sort', e.target.value)}>
            <option value=''>Sort</option>
            <option value='price.sale'>Price Low→High</option>
            <option value='-price.sale'>Price High→Low</option>
            <option value='-createdAt'>Newest</option>
          </select>
          <button onClick={()=> { setSp({}, { replace:true }); }} className='btn btn-outline text-xs'>Reset</button>
        </div>
      </div>
      <div className='grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {data.items.map(p=> {
          const wished = wishlist.includes(p._id);
          return (
          <div key={p._id} className='group relative bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-neutral-600 transition flex flex-col overflow-hidden'>
            <button
              onClick={async (e)=> {
                e.stopPropagation(); e.preventDefault();
                if(!user) return window.location.href='/login';
                toggleWishlistLocal(p._id);
                try {
                  if(!wished) await api.post(`/auth/me/wishlist/${p._id}`); else await api.delete(`/auth/me/wishlist/${p._id}`);
                } catch(_){}
              }}
              className={'absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full backdrop-blur bg-neutral-800/60 border border-neutral-700 hover:border-neutral-500 '+ (wished? 'text-neon-pink':'text-neutral-300')}>♥</button>
            <Link to={'/products/'+p._id} className='flex flex-col flex-1'>
            <div className='aspect-square mb-3 bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-sm'>IMG</div>
            <div className='font-medium group-hover:text-white text-neutral-200 line-clamp-2'>{p.name}</div>
            <div className='mt-auto flex items-baseline gap-2'>
              <span className='text-lg font-semibold text-white'>₹{p.price.sale}</span>
              {p.price.mrp && <span className='text-xs line-through text-neutral-500'>₹{p.price.mrp}</span>}
            </div>
            {p.ratingCount>0 && <div className='text-xs text-amber-400 mt-1'>★ {p.ratingAvg.toFixed(1)} ({p.ratingCount})</div>}
            </Link>
          </div>
        );})}
      </div>
    </div>
  );
}
