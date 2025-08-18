import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useCartStore } from '../lib/store';
import { useToast } from '../components/ui/ToastProvider';
import { useAuthStore } from '../lib/store';

export default function ProductDetail(){
  const { id } = useParams();
  const qc = useQueryClient();
  const setCart = useCartStore(s=>s.setCart);
  const user = useAuthStore(s=>s.user);
  const toast = useToast();
  const { data, isLoading, error } = useQuery({ queryKey: ['product', id], queryFn: async()=> (await api.get('/products/'+id)).data });
  const reviewsQ = useQuery({ queryKey: ['reviews', id], queryFn: async()=> (await api.get('/reviews/product/'+id)).data });
  const addMut = useMutation({ mutationFn: async ()=> (await api.post('/cart',{ productId: id, qty:1 })).data, onSuccess: (cart)=> { setCart(cart); toast?.push('Added to cart',{ type:'info'}); } });
  if(isLoading) return <div className='p-10 text-center text-neutral-500 animate-pulse'>Loading...</div>;
  if(error) return <div className='p-10 text-center text-red-400'>Not found</div>;
  const p = data;
  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Link to='/products' className='text-sm text-neutral-400 hover:text-white'>&larr; Back</Link>
      <div className='grid md:grid-cols-2 gap-10 mt-6'>
        <div className='bg-neutral-900 rounded-xl aspect-square flex items-center justify-center text-neutral-600 relative overflow-hidden'>
          <div className='absolute inset-0 flex items-center justify-center text-neutral-700 text-xs'>Gallery</div>
        </div>
        <div>
          <h1 className='text-3xl font-bold mb-2'>{p.name}</h1>
          <div className='flex items-baseline gap-3 mb-4'>
            <span className='text-2xl font-semibold'>₹{p.price.sale}</span>
            {p.price.mrp && <span className='text-sm line-through text-neutral-500'>₹{p.price.mrp}</span>}
          </div>
          {p.ratingCount>0 && <div className='text-sm text-amber-400 mb-4'>★ {p.ratingAvg.toFixed(1)} ({p.ratingCount})</div>}
          <p className='text-neutral-300 text-sm leading-relaxed mb-6'>{p.description||'No description yet.'}</p>
          <div className='flex gap-3'>
            <button onClick={()=> addMut.mutate()} disabled={addMut.isPending} className='btn btn-gradient'>
              {addMut.isPending? 'Adding...' : 'Add to Cart'}
            </button>
            {user && <ReviewButton productId={id} qc={qc} toast={toast} />}
          </div>
        </div>
      </div>
      <section className='mt-12'>
        <h2 className='text-xl font-semibold mb-4'>Reviews</h2>
        {reviewsQ.isLoading && <div className='text-neutral-500 text-sm'>Loading reviews...</div>}
        {reviewsQ.data && reviewsQ.data.length===0 && <div className='text-neutral-500 text-sm'>No reviews yet.</div>}
        <div className='space-y-4'>
          {reviewsQ.data && reviewsQ.data.map(r=> (
            <div key={r._id} className='glass rounded-xl p-4 text-sm'>
              <div className='flex items-center gap-2 mb-1'><span className='text-amber-400'>★ {r.rating}</span><span className='text-neutral-500 text-xs'>{new Date(r.createdAt).toLocaleDateString()}</span></div>
              {r.title && <div className='font-medium mb-1'>{r.title}</div>}
              {r.body && <div className='text-neutral-300'>{r.body}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReviewButton({ productId, qc, toast }){
  const [open,setOpen]=React.useState(false);
  return <>
    <button onClick={()=> setOpen(true)} className='btn btn-outline'>Review</button>
    {open && <ReviewModal productId={productId} onClose={()=> setOpen(false)} qc={qc} toast={toast} />}
  </>;
}

function ReviewModal({ productId, onClose, qc, toast }){
  const [rating,setRating]=React.useState(5);
  const [title,setTitle]=React.useState('');
  const [body,setBody]=React.useState('');
  const [submitting,setSubmitting]=React.useState(false);
  async function submit(e){
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/reviews',{ productId, rating, title, body });
      toast?.push('Review submitted (pending approval)');
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
      onClose();
    } catch(err){ toast?.push(err.response?.data?.error||'Failed',{ type:'error'}); }
    finally { setSubmitting(false); }
  }
  return (
    <div className='fixed inset-0 z-[200] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose}></div>
      <form onSubmit={submit} className='relative glass w-full max-w-md rounded-2xl p-6 space-y-4'>
        <h3 className='text-lg font-semibold'>Write a review</h3>
        <div className='flex gap-1'>
          {[1,2,3,4,5].map(n=> <button type='button' key={n} onClick={()=> setRating(n)} className={'text-xl '+ (n<=rating? 'text-amber-400':'text-neutral-600')}>★</button>)}
        </div>
        <input className='field' placeholder='Title (optional)' value={title} onChange={e=> setTitle(e.target.value)} />
        <textarea className='field h-32 resize-none' placeholder='Share your experience' value={body} onChange={e=> setBody(e.target.value)} />
        <div className='flex gap-3 justify-end'>
          <button type='button' onClick={onClose} className='btn btn-outline'>Cancel</button>
          <button disabled={submitting} className='btn btn-gradient'>{submitting? 'Saving...':'Submit'}</button>
        </div>
      </form>
    </div>
  );
}
