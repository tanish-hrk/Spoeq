import { useEffect, useState } from 'react';
import { useCartStore } from '../lib/store';
import api from '../lib/api';

export default function Cart(){
  const { items, setCart } = useCartStore(s=>({ items: s.items, setCart: s.setCart }));
  const [couponCode,setCouponCode]=useState('');
  const [discount,setDiscount]=useState(0);
  const [applying,setApplying]=useState(false);
  const [message,setMessage]=useState(null);
  useEffect(()=> { (async()=> { const res = await api.get('/cart'); setCart(res.data); })(); }, [setCart]);
  const subtotal = items.reduce((a,i)=> a + (i.priceSnapshot||0) * i.qty, 0);
  const grandTotal = subtotal - discount;
  async function applyCoupon(e){
    e.preventDefault(); setMessage(null); setApplying(true);
    try {
      const res = await api.post('/cart/apply-coupon',{ code: couponCode });
      setCart(res.data.cart); setDiscount(res.data.discount); setMessage('Applied ✓');
    } catch(err){ setMessage(err.response?.data?.error||'Failed'); }
    finally { setApplying(false); }
  }
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
      <form onSubmit={applyCoupon} className='mt-8 flex gap-3 items-center'>
        <input value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder='Coupon code' className='field flex-1' />
        <button disabled={applying||!couponCode} className='btn btn-outline text-sm'>{applying? 'Applying...':'Apply'}</button>
        {message && <span className='text-xs text-neutral-400'>{message}</span>}
      </form>
      <div className='mt-6 space-y-2 text-sm border-t border-neutral-800 pt-4'>
        <div className='flex justify-between'><span className='text-neutral-400'>Subtotal</span><span>₹{subtotal}</span></div>
        {discount>0 && <div className='flex justify-between text-emerald-400'><span>Discount</span><span>-₹{discount}</span></div>}
        <div className='flex justify-between font-semibold text-white pt-2 border-t border-neutral-800'><span>Total</span><span>₹{grandTotal}</span></div>
      </div>
      <a href='/checkout' className='mt-6 inline-block bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded text-white font-medium'>Checkout</a>
    </div>
  );
}
