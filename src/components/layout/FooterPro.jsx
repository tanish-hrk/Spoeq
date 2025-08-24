import React from 'react';
import { Sun, Moon } from 'lucide-react';

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

  const linkCls = 'text-sm text-neutral-500 hover:text-neutral-300';
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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8'>
        {section('Shop', ['Fitness', 'Running', 'Training', 'Team Sports'])}
        {section('Support', ['Contact', 'Shipping', 'Returns', 'FAQ'])}
        {section('Company', ['About', 'Careers', 'Partner', 'Blog'])}
        <div>
          <div className='text-xs uppercase tracking-wide text-neutral-400 mb-3'>Theme</div>
          <button onClick={()=> setDark(d=>!d)} className='inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-eco-grass/60'>
            {dark? <Moon size={16} /> : <Sun size={16} />}
            <span className='text-sm'>{dark? 'Dark':'Light'} mode</span>
          </button>
        </div>
      </div>
      <div className='text-center text-xs text-neutral-500 py-6 border-t border-neutral-200 dark:border-neutral-800'>
        © {new Date().getFullYear()} SPOEQ — All rights reserved.
      </div>
    </footer>
  );
}
