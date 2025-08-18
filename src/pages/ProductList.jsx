import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';

export default function ProductList(){
  const user = useAuthStore(s=> s.user);
  const wishlist = useAuthStore(s=> s.wishlist);
  const toggleWishlistLocal = useAuthStore(s=> s.toggleWishlistLocal);
  const [suggestions,setSuggestions]=useState([]);
  const [showSuggest,setShowSuggest]=useState(false);
  const [sp,setSp] = useSearchParams();
  const qSearch = sp.get('q')||'';
  const qSort = sp.get('sort')||'';
  const qCategory = sp.get('cat')||'';
  const qBrand = sp.get('brand')||'';
  const qMin = sp.get('min')||'';
  const qMax = sp.get('max')||'';
  const queryStr = new URLSearchParams({
    ...(qSearch? { search: qSearch }: {}),
    ...(qSort? { sort: qSort }: {}),
    ...(qMin? { minPrice: qMin }: {}),
    ...(qMax? { maxPrice: qMax }: {}),
    limit: '24'
  }).toString();
  const facetsQueryStr = new URLSearchParams({
    ...(qSearch? { search: qSearch }: {}),
    ...(qCategory? { category: qCategory }: {}),
    ...(qBrand? { brand: qBrand }: {}),
    ...(qMin? { minPrice: qMin }: {}),
    ...(qMax? { maxPrice: qMax }: {})
  }).toString();
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryStr],
    queryFn: async () => (await api.get('/products?'+queryStr)).data
  });
  const { data: facets } = useQuery({
    queryKey: ['facets', facetsQueryStr],
    queryFn: async ()=> (await api.get('/products/facets/all?'+facetsQueryStr)).data,
    staleTime: 60_000
  });

  useEffect(()=> {
    const term = qSearch.trim();
    if(!term){ setSuggestions([]); return; }
    const handle = setTimeout(async ()=> {
      try { const res = await api.get('/products/suggest?q='+encodeURIComponent(term)); setSuggestions(res.data); } catch(_){ }
    }, 250);
    return ()=> clearTimeout(handle);
  }, [qSearch]);
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
      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight gradient-text mb-2'>Fresh Gear</h1>
          {facets && <div className='flex flex-wrap gap-3 text-[11px] text-neutral-400'>
            {qCategory && <span className='px-2 py-1 rounded bg-neutral-800 border border-neutral-700'>Category: {qCategory}</span>}
            {qBrand && <span className='px-2 py-1 rounded bg-neutral-800 border border-neutral-700'>Brand: {qBrand}</span>}
            {(qCategory||qBrand||qSearch||qMin||qMax) && <button onClick={()=> { setSp({}, { replace:true }); }} className='underline text-neutral-400 hover:text-white'>Clear filters</button>}
          </div>}
        </div>
        <div className='flex flex-wrap gap-3 items-center'>
          <div className='relative'>
            <input className='field w-48' placeholder='Search' value={qSearch} onChange={e=> { setParam('q', e.target.value); setShowSuggest(true); }} onFocus={()=> setShowSuggest(true)} onBlur={()=> setTimeout(()=> setShowSuggest(false),150)} />
            {showSuggest && suggestions.length>0 && (
              <div className='absolute z-20 mt-1 w-64 max-w-[16rem] bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-2 space-y-1'>
                {suggestions.map(s=> (
                  <button key={s._id} onMouseDown={()=> { setParam('q', s.name.split(' ')[0]); setShowSuggest(false); }} className='w-full text-left text-[11px] px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300'>
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
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
      {facets && (
        <div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <FacetPanel title='Categories'>
            {facets.categories.map(c=> (
              <button key={c.value} onClick={()=> setParam('cat', c.value)} className={'text-left text-xs px-2 py-1 rounded border transition '+(qCategory===c.value? 'bg-neon-pink/20 border-neon-pink text-white':'bg-neutral-900 border-neutral-800 hover:border-neutral-600 text-neutral-300')}>{c.value} <span className='text-neutral-500'>({c.count})</span></button>
            ))}
          </FacetPanel>
          <FacetPanel title='Brands'>
            {facets.brands.map(b=> (
              <button key={b.value} onClick={()=> setParam('brand', b.value)} className={'text-left text-xs px-2 py-1 rounded border transition '+(qBrand===b.value? 'bg-neon-pink/20 border-neon-pink text-white':'bg-neutral-900 border-neutral-800 hover:border-neutral-600 text-neutral-300')}>{b.value} <span className='text-neutral-500'>({b.count})</span></button>
            ))}
          </FacetPanel>
          <FacetPanel title='Price Range'>
            {facets.price && <div className='text-[11px] text-neutral-400'>Min ₹{facets.price.min} • Max ₹{facets.price.max}</div>}
            <div className='flex flex-wrap gap-2 mt-2'>
              {facets.buckets.map((b,i)=> (
                <span key={i} className='text-[10px] px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400'>{b._id||b.bucket}: {b.count}</span>
              ))}
            </div>
          </FacetPanel>
        </div>
      )}
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

function FacetPanel({ title, children }){
  return (
    <div className='bg-neutral-900/60 border border-neutral-800 rounded-xl p-4'>
      <div className='text-xs font-semibold mb-3 tracking-wide text-neutral-300'>{title}</div>
      <div className='flex flex-col gap-1'>{children}</div>
    </div>
  );
}
