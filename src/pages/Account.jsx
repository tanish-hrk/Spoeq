import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function Account(){
  const qc = useQueryClient();
  const { data: profile, isLoading, error } = useQuery({ queryKey:['me'], queryFn: async ()=> (await api.get('/auth/me')).data });
  const addMutation = useMutation({
    mutationFn: async (payload)=> (await api.post('/auth/me/addresses', payload)).data,
    onSuccess: ()=> { qc.invalidateQueries({ queryKey:['me'] }); setForm(initial); }
  });
  const updateMutation = useMutation({
    mutationFn: async ({ idx, payload })=> (await api.patch('/auth/me/addresses/'+idx, payload)).data,
    onSuccess: ()=> qc.invalidateQueries({ queryKey:['me'] })
  });
  const deleteMutation = useMutation({
    mutationFn: async (idx)=> (await api.delete('/auth/me/addresses/'+idx)).data,
    onSuccess: ()=> qc.invalidateQueries({ queryKey:['me'] })
  });
  const initial = { line1:'', line2:'', city:'', state:'', country:'', zip:'', isDefault:false };
  const [form,setForm] = useState(initial);

  if(isLoading) return <div className='p-6 text-neutral-400'>Loading account...</div>;
  if(error) return <div className='p-6 text-red-400 text-sm'>Failed to load profile.</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 gradient-text'>Account</h1>
      <div className='grid gap-8 md:grid-cols-2'>
        <div>
          <h2 className='text-sm font-semibold text-white mb-3'>Profile</h2>
          <div className='space-y-1 text-xs text-neutral-300'>
            <div><span className='text-neutral-500'>Name:</span> {profile.name||'-'}</div>
            <div><span className='text-neutral-500'>Email:</span> {profile.email}</div>
            <div><span className='text-neutral-500'>Roles:</span> {profile.roles.join(', ')}</div>
          </div>
          <h2 className='text-sm font-semibold text-white mt-8 mb-3'>Addresses</h2>
          <div className='space-y-3'>
            {profile.addresses?.map((a,i)=> (
              <div key={i} className='p-3 rounded-lg border border-neutral-800 bg-neutral-900/70 text-xs relative'>
                {a.isDefault && <div className='absolute top-2 right-2 text-[10px] px-1 py-0.5 rounded bg-neon-pink/20 text-neon-pink border border-neon-pink/40'>Default</div>}
                <div className='text-neutral-200'>{a.line1}</div>
                {a.line2 && <div>{a.line2}</div>}
                <div className='text-neutral-400'>{a.city}, {a.state}</div>
                <div className='text-neutral-500'>{a.country} - {a.zip}</div>
                <div className='mt-2 flex gap-2'>
                  <button onClick={()=> updateMutation.mutate({ idx:i, payload:{ isDefault:true } })} disabled={a.isDefault} className='px-2 py-1 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-[10px] disabled:opacity-40'>Make Default</button>
                  <button onClick={()=> deleteMutation.mutate(i)} className='px-2 py-1 rounded bg-neutral-800 border border-neutral-700 hover:border-red-500 text-[10px]'>Delete</button>
                </div>
              </div>
            ))}
            {!(profile.addresses?.length) && <div className='text-neutral-500 text-xs'>No addresses saved.</div>}
          </div>
        </div>
        <div>
          <h2 className='text-sm font-semibold text-white mb-3'>Add Address</h2>
          <form onSubmit={(e)=> { e.preventDefault(); addMutation.mutate(form); }} className='space-y-3 text-xs'>
            <input value={form.line1} onChange={e=> setForm(f=> ({...f,line1:e.target.value}))} required placeholder='Line 1' className='w-full field' />
            <input value={form.line2} onChange={e=> setForm(f=> ({...f,line2:e.target.value}))} placeholder='Line 2' className='w-full field' />
            <div className='grid grid-cols-2 gap-3'>
              <input value={form.city} onChange={e=> setForm(f=> ({...f,city:e.target.value}))} required placeholder='City' className='field' />
              <input value={form.state} onChange={e=> setForm(f=> ({...f,state:e.target.value}))} required placeholder='State' className='field' />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <input value={form.country} onChange={e=> setForm(f=> ({...f,country:e.target.value}))} required placeholder='Country' className='field' />
              <input value={form.zip} onChange={e=> setForm(f=> ({...f,zip:e.target.value}))} required placeholder='ZIP' className='field' />
            </div>
            <label className='flex items-center gap-2 text-neutral-400'>
              <input type='checkbox' checked={form.isDefault} onChange={e=> setForm(f=> ({...f,isDefault:e.target.checked}))} />
              <span>Set as default</span>
            </label>
            <button disabled={addMutation.isLoading} className='btn btn-gradient text-xs'>{addMutation.isLoading? 'Saving...':'Save Address'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
