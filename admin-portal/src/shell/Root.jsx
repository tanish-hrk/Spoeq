import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, LineChart, Package, ShoppingCart, LogOut, Sun, Moon } from 'lucide-react'

export default function Root() {
  const [open, setOpen] = useState(true)
  const [dark, setDark] = useState(false)
  const loc = useLocation()
  const authed = typeof window !== 'undefined' && !!localStorage.getItem('adm-token')

  useEffect(() => {
    const m = localStorage.getItem('adm-dark') === '1'
    setDark(m)
    document.documentElement.classList.toggle('dark', m)
  }, [])

  const toggleDark = () => {
    const v = !dark
    setDark(v)
    document.documentElement.classList.toggle('dark', v)
    localStorage.setItem('adm-dark', v ? '1' : '0')
  }

  if (!authed) return <Navigate to="/login" replace />

  return (
    <div className="h-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
      <header className="header col-span-2 flex items-center justify-between px-4 py-2 shadow">
        <div className="flex items-center gap-3">
          <button className="btn btn-outline text-white/90 border-white/25" onClick={()=>setOpen(!open)}>
            <Menu size={18}/>
          </button>
          <span className="font-semibold tracking-wide">Spoeq Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark} className="btn btn-outline text-white/90 border-white/25">
            {dark ? <Sun size={16}/> : <Moon size={16}/>} <span className="hidden sm:inline">Theme</span>
          </button>
          <button className="btn btn-outline text-white/90 border-white/25">
            <LogOut size={16}/> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ x: -220, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -220, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="hidden sm:block h-full w-56 p-3 border-r border-black/10 dark:border-white/10"
          >
            <nav className="space-y-1">
              <SideLink to="/" icon={<LineChart size={18}/>} label="Dashboard"/>
              <SideLink to="/products" icon={<Package size={18}/> } label="Products"/>
              <SideLink to="/orders" icon={<ShoppingCart size={18}/> } label="Orders"/>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="p-4 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div key={loc.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet/>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="col-span-2 text-sm text-gray-500 border-t border-black/10 dark:border-white/10 px-4 py-2">
        <span>© {new Date().getFullYear()} Spoeq Admin • v0.1</span>
      </footer>
    </div>
  )
}

function SideLink({ to, icon, label }) {
  return (
    <NavLink to={to} end className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-600 text-white shadow' : 'hover:bg-emerald-50 dark:hover:bg-white/5'}`}>
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}
