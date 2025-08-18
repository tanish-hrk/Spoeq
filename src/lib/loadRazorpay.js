// Dynamically load Razorpay Checkout script
export function loadRazorpay(){
  return new Promise((resolve,reject)=>{
    if(typeof window !== 'undefined' && window.Razorpay){ return resolve(window.Razorpay); }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = ()=> resolve(window.Razorpay);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
