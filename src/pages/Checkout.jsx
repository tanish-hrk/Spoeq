import { useState } from 'react';
import api from '../lib/api';
import { loadRazorpay } from '../lib/loadRazorpay';

export default function Checkout(){
  const [creating,setCreating]=useState(false);
  const [order,setOrder]=useState(null);
  const [payment,setPayment]=useState(null);
  const [error,setError]=useState(null);

  async function createDraft(){
    setCreating(true); setError(null);
    try { const res = await api.post('/orders'); setOrder(res.data); } catch(e){ setError(e.response?.data?.error||e.message); } finally { setCreating(false); }
  }
  async function createIntent(){
    try { const res = await api.post(`/orders/${order._id}/create-payment-intent`); setPayment(res.data); } catch(e){ setError(e.response?.data?.error||e.message); }
  }

  async function launchPayment(){
    if(!payment) return;
    try {
      const Razorpay = await loadRazorpay();
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: 'SPOEQ',
        description: 'Order #' + order._id.slice(-6),
        order_id: payment.razorpayOrderId,
        handler: async function (resp){
          try {
            await api.post('/orders/verify', {
              orderId: order._id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature
            });
            alert('Payment Success! Order paid.');
            setOrder(o=> ({ ...o, status: 'paid' }));
          } catch(e){
            alert('Verification failed: '+ (e.response?.data?.error||e.message));
          }
        },
        theme: { color: '#ff2d6d' },
        prefill: {},
        modal: { ondismiss: ()=> console.log('Payment closed') }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch(e){ setError('Failed to load payment: '+e.message); }
  }
  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>
      <div className='space-y-4'>
        {!order && <button onClick={createDraft} disabled={creating} className='px-5 py-3 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50'>Create Order Draft</button>}
        {order && !payment && <button onClick={createIntent} className='px-5 py-3 rounded bg-emerald-600 hover:bg-emerald-500'>Create Payment Intent</button>}
  {payment && <button onClick={launchPayment} className='px-5 py-3 rounded bg-pink-600 hover:bg-pink-500'>Pay Now</button>}
        {order && <pre className='bg-neutral-900 text-xs p-3 rounded overflow-x-auto'>{JSON.stringify(order,null,2)}</pre>}
        {payment && <pre className='bg-neutral-900 text-xs p-3 rounded overflow-x-auto'>{JSON.stringify(payment,null,2)}</pre>}
        {error && <div className='text-red-400 text-sm'>{error}</div>}
      </div>
    </div>
  );
}
