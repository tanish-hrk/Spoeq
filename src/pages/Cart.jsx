import React, { useEffect } from 'react';
import { useCartStore } from '../lib/store';
import api from '../lib/api';

export default function Cart(){
  const { items, setCart } = useCartStore(s=>({ items: s.items, setCart: s.setCart }));
  useEffect(()=> { (async()=> { const res = await api.get('/cart'); setCart(res.data); })(); }, [setCart]);
  const subtotal = items.reduce((a,i)=> a + (i.priceSnapshot||0) * i.qty, 0);
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>
      {items.length===0 && <div className='text-neutral-500'>Empty vibes. <a className='underline' href='/products'>Shop now</a></div>}
      <div className='space-y-4'>
        {items.map(i=> (
          <div key={i.productId} className='flex items-center justify-between bg-neutral-900 px-4 py-3 rounded'>
            <div className='flex-1'>
              <div className='text-sm font-medium'>{i.productId}</div>
              <div className='text-xs text-neutral-500'>{i.qty} x ₹{i.priceSnapshot}</div>
            </div>
            <div className='font-semibold'>₹{(i.priceSnapshot||0)*i.qty}</div>
          </div>
        ))}
      </div>
      <div className='mt-8 flex justify-between items-center border-t border-neutral-800 pt-4'>
        <span className='text-neutral-400 text-sm'>Subtotal</span>
        <span className='font-semibold'>₹{subtotal}</span>
      </div>
      <a href='/checkout' className='mt-6 inline-block bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded text-white font-medium'>Checkout</a>
    </div>
  );
}
