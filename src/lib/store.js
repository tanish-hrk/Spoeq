import { create } from 'zustand';

export const useAuthStore = create((set,get) => ({
  user: null,
  wishlist: [],
  setUser: (user) => set({ user }),
  setWishlist: (wishlist)=> set({ wishlist }),
  toggleWishlistLocal: (productId)=> {
    const current = get().wishlist;
    if(current.includes(productId)) set({ wishlist: current.filter(id=> id!==productId) }); else set({ wishlist: [...current, productId] });
  },
  logout: () => { localStorage.clear(); set({ user: null, wishlist: [] }); window.location.href='/'; }
}));

export const useCartStore = create((set)=>({
  items: [],
  coupon: null,
  setCart: (cart)=> set({ items: cart?.items||[], coupon: cart?.couponCode||null }),
  clear: ()=> set({ items: [], coupon: null })
}));
