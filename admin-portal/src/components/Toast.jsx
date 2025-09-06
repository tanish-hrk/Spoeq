import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id)=> setToasts(ts => ts.filter(t=> t.id !== id)), [])
  const push = useCallback((msg, opts={}) => {
    const id = Math.random().toString(36).slice(2)
    const t = { id, msg, type: opts.type||'info', timeout: opts.timeout ?? 2800 }
    setToasts(ts => [...ts, t])
    setTimeout(()=> remove(id), t.timeout)
  }, [remove])

  const api = useMemo(()=> ({ push, remove }), [push, remove])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed z-50 bottom-4 right-4 space-y-2">
        {toasts.map(t=> (
          <div key={t.id} className={"px-3 py-2 rounded shadow text-sm max-w-xs "+(t.type==='error'? 'bg-red-600 text-white':'bg-emerald-600 text-white')}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastCtx)
  if(!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
