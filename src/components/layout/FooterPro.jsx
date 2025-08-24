import React from 'react';
import { Sun, Moon, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function FooterPro(){
  const [dark,setDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  React.useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark? 'dark':'light');
  }, [dark]);
  React.useEffect(()=>{
    const saved = localStorage.getItem('theme');
    if(saved) setDark(saved==='dark');
  }, []);

  const linkCls = 'text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300';
  const section = (title, links)=> (
    <div>
      <div className='text-xs uppercase tracking-wide text-neutral-400 mb-3'>{title}</div>
      <ul className='space-y-2'>
        {links.map(l=> <li key={l}><a className={linkCls} href='#'>{l}</a></li>)}
      </ul>
    </div>
  );

  return (
    <footer className='border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8'>
        {section('Shop', ['Fitness', 'Running', 'Training', 'Team Sports', 'Outdoor', 'Yoga'])}
        {section('Help', ['Contact', 'Shipping', 'Returns', 'FAQ', 'Track Order'])}
        {section('Company', ['About Us', 'Careers', 'Press', 'Partners'])}
        {section('Policies', ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookies'])}
        <div>
          <div className='text-xs uppercase tracking-wide text-neutral-400 mb-3'>Get the app</div>
          <div className='flex gap-3 mb-4'>
            <a href='#' className='h-10 w-32 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-xs font-semibold'>App Store</a>
            <a href='#' className='h-10 w-32 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-xs font-semibold'>Google Play</a>
          </div>
          <div className='text-xs uppercase tracking-wide text-neutral-400 mb-2'>Follow us</div>
          <div className='flex gap-3 text-neutral-600 dark:text-neutral-300'>
            <a aria-label='Facebook' href='#' className='hover:text-eco-leaf'><Facebook size={16} /></a>
            <a aria-label='Instagram' href='#' className='hover:text-eco-leaf'><Instagram size={16} /></a>
            <a aria-label='Twitter' href='#' className='hover:text-eco-leaf'><Twitter size={16} /></a>
            <a aria-label='YouTube' href='#' className='hover:text-eco-leaf'><Youtube size={16} /></a>
          </div>
          <div className='mt-4'>
            <div className='text-xs uppercase tracking-wide text-neutral-400 mb-2'>Theme</div>
            <button onClick={()=> setDark(d=>!d)} className='inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-eco-grass/60'>
              {dark? <Moon size={16} /> : <Sun size={16} />}
              <span className='text-sm'>{dark? 'Dark':'Light'} mode</span>
            </button>
          </div>
        </div>
      </div>
      <div className='border-t border-neutral-200 dark:border-neutral-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500'>
          <div>© {new Date().getFullYear()} SPOEQ — All rights reserved.</div>
          <div className='flex gap-3'>
            <a className={linkCls} href='#'>Store Locator</a>
            <a className={linkCls} href='#'>Gift Cards</a>
            <a className={linkCls} href='#'>Affiliates</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
