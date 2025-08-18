import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Link } from 'react-router-dom';

export default function AdminProducts(){
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey:['adminProducts'], queryFn: async ()=> (await api.get('/products?limit=100')).data });
  const [form,setForm]=useState({ name:'', slug:'', sale: '', mrp:'', stock:'', brand:'', categories:'', description:'' });
  const createMutation = useMutation({
    mutationFn: async ()=> (await api.post('/products', { name: form.name, slug: form.slug, price:{ mrp:Number(form.mrp||0), sale:Number(form.sale||0) }, stock:Number(form.stock||0), brand: form.brand||undefined, categories: form.categories? form.categories.split(',').map(s=> s.trim()).filter(Boolean): undefined, description: form.description||undefined })).data,
    onSuccess: ()=> { qc.invalidateQueries({ queryKey:['adminProducts'] }); setForm({ name:'', slug:'', sale:'', mrp:'', stock:'', brand:'', categories:'', description:'' }); }
  });
  if(isLoading) return <div className='p-6 text-neutral-400'>Loading products...</div>;
  if(error) return <div className='p-6 text-red-400 text-sm'>Error loading products.</div>;
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold gradient-text mb-6'>Products</h1>
      <form onSubmit={(e)=> { e.preventDefault(); createMutation.mutate(); }} className='mb-8 grid gap-3 md:grid-cols-3 bg-neutral-900/60 border border-neutral-800 rounded-lg p-4 text-[11px]'>
        <input required placeholder='Name' value={form.name} onChange={e=> setForm(f=> ({...f,name:e.target.value}))} className='field' />
        <input required placeholder='Slug' value={form.slug} onChange={e=> setForm(f=> ({...f,slug:e.target.value}))} className='field' />
        <input required placeholder='Sale Price' value={form.sale} onChange={e=> setForm(f=> ({...f,sale:e.target.value}))} className='field' />
        <input placeholder='MRP' value={form.mrp} onChange={e=> setForm(f=> ({...f,mrp:e.target.value}))} className='field' />
        <input required placeholder='Stock' value={form.stock} onChange={e=> setForm(f=> ({...f,stock:e.target.value}))} className='field' />
        <input placeholder='Brand' value={form.brand} onChange={e=> setForm(f=> ({...f,brand:e.target.value}))} className='field' />
        <input placeholder='Categories (comma separated)' value={form.categories} onChange={e=> setForm(f=> ({...f,categories:e.target.value}))} className='md:col-span-2 field' />
        <textarea placeholder='Description' value={form.description} onChange={e=> setForm(f=> ({...f,description:e.target.value}))} className='md:col-span-3 field min-h-[60px]' />
        <button disabled={createMutation.isLoading} className='btn btn-gradient text-xs md:col-span-1'>{createMutation.isLoading? 'Creating...':'Create'}</button>
      </form>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {data.items.map(p=> (
          <div key={p._id} className='p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg flex flex-col'>
            <div className='aspect-video mb-2 bg-neutral-800 rounded'></div>
            <div className='text-xs font-semibold text-white line-clamp-2 mb-1'>{p.name}</div>
            <div className='text-[11px] text-neutral-400 mb-2'>₹{p.price.sale} {p.price.mrp && <span className='line-through ml-1'>₹{p.price.mrp}</span>}</div>
            <Link to={'/products/'+p._id} className='text-[11px] px-2 py-1 rounded border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-center mt-auto'>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
