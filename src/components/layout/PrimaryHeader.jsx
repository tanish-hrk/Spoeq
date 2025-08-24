import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../lib/store';
import { Search, MapPin, User, ShoppingCart, Heart, ListOrdered } from 'lucide-react';

// Zepto-like header: top utility bar with logo, location, search, user & cart; secondary category strip
const categories = [
  { key: 'fitness', label: 'Fitness' },
  { key: 'running', label: 'Running' },
  { key: 'training', label: 'Training' },
  { key: 'team', label: 'Team Sports' },
  { key: 'eco', label: 'Eco Gear' },
  { key: 'sale', label: 'Sale' },
];

export default function PrimaryHeader(){
  const user = useAuthStore(s=> s.user);
  const items = useCartStore(s=> s.items);
  const navigate = useNavigate();
  const loc = useLocation();
  const [term,setTerm] = React.useState(() => new URLSearchParams(window.location.search).get('q')||'');

  function submit(e){
    e.preventDefault();
    const q = term.trim();
    const params = new URLSearchParams();
    if(q) params.set('q', q);
    navigate('/products'+ (params.toString()? ('?'+params.toString()):''));
  }

  return (
    <header className='sticky top-0 z-50 shadow-sm'>
      {/* Top bar */}
      <div className='w-full shadow-md text-neutral-800 bg-[linear-gradient(rgb(224,245,233),_rgb(255,255,255))]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='h-16 flex items-center gap-4'>
            <Link to='/' className='flex items-center font-black text-xl tracking-tight bg-gradient-to-r from-eco-leaf via-eco-moss to-eco-grass bg-clip-text text-transparent'>SPOEQ</Link>
            <button className='hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 hover:bg-white/90 border border-eco-grass/30 hover:border-eco-grass/60 text-xs text-neutral-700' aria-label='Select delivery location'>
              <MapPin size={14} className='text-eco-leaf' />
              <span className='font-medium text-neutral-800'>Set Location</span>
            </button>
            <form onSubmit={submit} className='flex-1 flex items-center'>
              <div className='relative w-full'>
                <input value={term} onChange={e=> setTerm(e.target.value)} placeholder='Search sports gear, brands, categories...' aria-label='Search products' className='w-full h-11 pl-11 pr-4 rounded-xl bg-white/80 border border-eco-grass/40 focus:border-eco-leaf outline-none text-sm placeholder:text-neutral-500 text-neutral-800 transition backdrop-blur-sm' />
                <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500' />
                {term && <button type='button' aria-label='Clear search' onClick={()=> setTerm('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 text-xs'>✕</button>}
              </div>
            </form>
            <div className='flex items-center gap-4'>
              {user ? (
                <Link to='/account' aria-label='Account' className='flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900 font-semibold'>
                  <User size={16} />
                  <span className='hidden sm:inline'>Hi, {user.name?.split(' ')[0]||'you'}</span>
                </Link>
              ) : (
                <Link to='/login' aria-label='Login' className='flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900 font-semibold'>
                  <User size={16} />
                  <span className='hidden sm:inline'>Login</span>
                </Link>
              )}
              <Link to='/wishlist' aria-label='Wishlist' className='relative text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1'>
                <Heart size={16} />
              </Link>
              <Link to='/orders' aria-label='Orders' className='relative text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1'>
                <ListOrdered size={16} />
              </Link>
              <Link to='/cart' aria-label='Cart' className='relative text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1'>
                <ShoppingCart size={16} />
                {items.length>0 && <span className='absolute -top-2 -right-2 bg-eco-leaf text-white text-[10px] px-1.5 py-0.5 rounded-full'>{items.length}</span>}
              </Link>
              {user?.roles?.includes('admin') && (
                <Link to='/admin' aria-label='Admin dashboard' className='flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900'>
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Categories strip */}
      <div className='w-full bg-eco-fern/50 dark:bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-eco-fern/40 dark:supports-[backdrop-filter]:bg-neutral-950/70 border-b border-eco-grass/40 dark:border-neutral-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='flex items-center h-11 gap-6 overflow-x-auto scrollbar-thin'>
            {categories.map(c=> {
              const active = loc.pathname.startsWith('/products') && (new URLSearchParams(loc.search).get('q')||'') === c.key;
              return (
                <button key={c.key} onClick={()=> navigate('/products?q='+c.key)} className={'text-[12px] font-medium tracking-wide whitespace-nowrap transition px-2 py-1 rounded '+ (active? 'bg-eco-grass/30 text-neutral-900 dark:text-white border border-eco-grass/40':'text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800')}>{c.label}</button>
              );
            })}
            <div className='ml-auto hidden sm:flex items-center gap-3 pr-1'>
              <Link to='/wishlist' className='text-[12px] text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'>Wishlist</Link>
              <Link to='/orders' className='text-[12px] text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'>Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
