import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../lib/store';
import { shallow } from 'zustand/shallow';
import PrimaryHeader from './PrimaryHeader';

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
      <PrimaryHeader />
      <main className="flex-1 pb-20">{children}</main>
      <footer className="mt-auto py-10 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} SPOEQ. Built for speed & style.</p>
      </footer>
    </div>
  );
}
