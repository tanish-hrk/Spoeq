import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../lib/store';
import { shallow } from 'zustand/shallow';

export default function AppShell({ children }) {
  // Select individual slices to keep snapshots stable
  const user = useAuthStore(s=> s.user, shallow);
  const setUser = useAuthStore(s=> s.setUser);
  const items = useCartStore(s=> s.items);
  const location = useLocation();
  const hydratedRef = useRef(false);
  useEffect(()=> {
    // run only once after mount
    if(hydratedRef.current) return;
    hydratedRef.current = true;
    if(user) return; // already hydrated
    const token = localStorage.getItem('accessToken');
    if(!token) return;
    (async ()=> {
      try {
        const r = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/auth/me', { headers: { Authorization: 'Bearer '+token }});
        if(!r.ok) return;
        const data = await r.json();
        if(data) setUser({ id: data.id, email: data.email, name: data.name, roles: data.roles });
      } catch(_){}
    })();
  // empty deps to guarantee single run
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-40 glass flex items-center gap-6 px-6 h-16 backdrop-blur-xl border-b border-white/10">
        <Link to="/" className="font-black text-lg tracking-tight gradient-text">SPOEQ</Link>
        <Link to="/products" className={"text-sm font-medium transition "+ (active('/products')? 'text-white':'text-neutral-400 hover:text-white')}>Shop</Link>
        <Link to="/" className={"text-sm font-medium transition "+ (active('/drops')? 'text-white':'text-neutral-400 hover:text-white')}>Drops</Link>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/cart" className="relative text-neutral-300 hover:text-white transition">
            <span className="text-sm">Cart</span>
            {items.length>0 && <span className="absolute -top-1 -right-2 bg-neon-pink text-[10px] px-1.5 py-0.5 rounded-full shadow-glow">{items.length}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className={"text-sm font-medium transition "+(active('/orders')? 'text-white':'text-neutral-400 hover:text-white')}>Orders</Link>
              {user.roles?.includes('admin') && <Link to="/admin" className={"text-sm font-medium transition "+(active('/admin')? 'text-white':'text-neutral-400 hover:text-white')}>Admin</Link>}
              <Link to="/account" className="text-sm font-medium text-neutral-300 hover:text-white">Hi, {user.name?.split(' ')[0]||'you'}</Link>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline text-sm">Login</Link>
          )}
          <Link to="/register" className="hidden sm:inline-flex btn btn-gradient text-sm">Join</Link>
        </div>
      </nav>
      <main className="flex-1 pb-20">{children}</main>
      <footer className="mt-auto py-10 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} SPOEQ. Built for speed & style.</p>
      </footer>
    </div>
  );
}
