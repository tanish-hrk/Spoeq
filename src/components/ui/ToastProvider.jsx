import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts,setToasts] = useState([]);
  const push = useCallback((msg, opts={})=> {
    const id = Date.now()+Math.random();
    setToasts(t=> [...t, { id, msg, type: opts.type||'info', ttl: opts.ttl||3000 }]);
    setTimeout(()=> setToasts(t=> t.filter(x=> x.id!==id)), opts.ttl||3000);
  },[]);
  const api = { push };
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed z-[999] bottom-4 right-4 flex flex-col gap-2 max-w-xs">
        {toasts.map(t=> (
          <div key={t.id} className={`glass px-4 py-3 rounded-xl shadow-glow text-sm border-l-4 ${t.type==='error'?'border-red-500':'border-neon-pink'} animate-fade-in`}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(){
  return useContext(ToastCtx);
}
