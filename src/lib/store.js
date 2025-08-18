import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => { localStorage.clear(); set({ user: null }); window.location.href='/'; }
}));

export const useCartStore = create((set,get)=>({
  items: [],
  coupon: null,
  setCart: (cart)=> set({ items: cart?.items||[], coupon: cart?.couponCode||null }),
  clear: ()=> set({ items: [], coupon: null })
}));
