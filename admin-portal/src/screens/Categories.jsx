import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../utils/api'
import { useToast } from '../components/Toast'

export default function Categories(){
  const qc = useQueryClient()
  const toast = useToast()
  const [name, setName] = useState('')
  const { data, isLoading } = useQuery({ queryKey:['adm-cats'], queryFn: ()=> api.get('/products/facets/all').then(r=>r.data) })
  const cats = (data?.categories||[]).map(c=> c.value)

  const create = useMutation({ mutationFn: (n)=> api.post('/categories', { name:n }).then(r=>r.data), onSuccess: ()=> { toast.push('Category created'); qc.invalidateQueries({queryKey:['adm-cats']})}, onError: e=> toast.push(e?.response?.data?.error||'Failed', {type:'error'}) })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <div className="card p-4 flex gap-2">
        <input placeholder="New category name" value={name} onChange={e=> setName(e.target.value)} />
        <button className="btn btn-primary" onClick={()=> name && create.mutate(name)}>Add</button>
      </div>
      <div className="card p-4">
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {(isLoading? Array.from({length:12}) : cats).map((c,i)=> (
            <li key={c||i} className="px-3 py-2 rounded border border-black/10 dark:border-white/10">{c|| <span className="inline-block h-4 w-40 bg-emerald-100 dark:bg-white/10 rounded"/>}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
