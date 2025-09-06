import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function Wishlist(){
  // Select primitives separately to prevent new object each render causing endless updates
  const wishlist = useAuthStore(s=> s.wishlist);
  const user = useAuthStore(s=> s.user);
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=> {
    let cancelled = false;
    async function load(){
      if(!user){ setLoading(false); return; }
      if(!wishlist.length){ setItems([]); setLoading(false); return; }
      try {
        const res = await api.get('/auth/me/wishlist/populated');
        if(!cancelled) { setItems(res.data); setLoading(false); }
      } catch { if(!cancelled){ setItems([]); setLoading(false); } }
    }
    load();
    return ()=> { cancelled = true; };
  }, [wishlist, user]);

  if(!user) return <div className='p-6 max-w-4xl mx-auto text-neutral-400'>Login to view wishlist.</div>;
  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 gradient-text'>Wishlist</h1>
      {loading && <div className='text-neutral-500'>Loading...</div>}
      {!loading && items.length===0 && <div className='text-neutral-500 text-sm'>Nothing saved yet.</div>}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map(p=> (
          <Link key={p._id} to={'/products/'+p._id} className='group bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-neutral-600 transition flex flex-col'>
            <div className='aspect-video mb-3 bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-xs'>IMG</div>
            <div className='font-medium group-hover:text-white text-neutral-200 mb-1 line-clamp-2'>{p.name}</div>
            <div className='flex items-center gap-2 text-sm'><span className='text-white font-semibold'>₹{p.price.sale}</span>{p.price.mrp && <span className='line-through text-neutral-500 text-xs'>₹{p.price.mrp}</span>}</div>
            {p.ratingCount>0 && <div className='text-xs text-amber-400 mt-1'>★ {p.ratingAvg.toFixed(1)} ({p.ratingCount})</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
