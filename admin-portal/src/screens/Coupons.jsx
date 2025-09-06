import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import api from '../utils/api'

export default function Coupons(){
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['adm-coupons'], queryFn: () => api.get('/coupons').then(r=>r.data) })
  const create = useMutation({ mutationFn: (body)=> api.post('/coupons', body).then(r=>r.data), onSuccess: ()=> qc.invalidateQueries({queryKey:['adm-coupons']}) })

  const add = async ()=> {
    const code = prompt('Coupon code?')
    if(!code) return
    const value = Number(prompt('Value (percent or flat)?'))
    const type = prompt('Type: percent or flat', 'percent')
    try { await create.mutateAsync({ code, value, discountType: type==='percent'?'percent':'flat', active: true }) } catch(err){ alert(err?.response?.data?.error||'Failed') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <button onClick={add} className="btn btn-primary"><Plus size={16}/> New</button>
      </div>
      <div className="card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/5 dark:border-white/10">
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Usage</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading ? Array.from({length:6}) : data ?? []).map((c, i) => (
              <tr key={c?._id ?? i} className="border-b last:border-none border-black/5 dark:border-white/10">
                <td className="px-3 py-2">{c ? c.code : <div className="h-4 w-24 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{c ? c.discountType : <div className="h-4 w-16 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{c ? c.value : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{c ? (c.active? 'Yes':'No') : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{c ? (c.usageCount||0) : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
