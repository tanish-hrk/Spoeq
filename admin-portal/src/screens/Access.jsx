import { useState } from 'react'
import api from '../utils/api'

const KEYS = ['products','categories','inventory','orders','coupons','promotions','reviews','customers','content','analytics','settings']

export default function Access(){
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('customer')
  const [access, setAccess] = useState({})
  const [loading, setLoading] = useState(false)

  const load = async ()=>{
    if(!userId) return
    setLoading(true)
    try {
      const { data } = await api.get(`/auth/admin/users`, { params: { page:1, limit:1, id: userId } })
      // If API doesn't support id filter, try /auth/me when editing self, else simple /auth/admin/users and find client-side
  const found = data?.items?.find(u=> u._id===userId) || null
      setRole(found?.role || found?.roles?.[0] || 'customer')
      setAccess(found?.access || {})
    } catch(err){ alert(err?.response?.data?.error || 'Failed') }
    finally { setLoading(false) }
  }

  const save = async ()=>{
    if(!userId) return
    setLoading(true)
    try {
      const payload = { role, access }
      await api.patch(`/auth/admin/users/${userId}/access`, payload)
      alert('Saved')
    } catch(err){ alert(err?.response?.data?.error || 'Failed') }
    finally { setLoading(false) }
  }

  const toggle = (k)=> setAccess(a => ({ ...a, [k]: !a?.[k] }))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Access Management</h1>
      <div className="card p-4 space-y-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1">User ID</label>
            <input type="text" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="Mongo ObjectId" />
          </div>
          <button disabled={loading||!userId} onClick={load} className="btn btn-outline">Load</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              {['owner','admin','manager','support','editor','analyst','customer'].map(r=> <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <div className="text-sm mb-2">Access flags</div>
            <div className="grid sm:grid-cols-3 gap-2">
              {KEYS.map(k=> (
                <label key={k} className={`inline-flex items-center gap-2 p-2 rounded border ${access?.[k] ? 'bg-emerald-50 border-emerald-200' : 'border-black/10 dark:border-white/10'}`}>
                  <input type="checkbox" checked={!!access?.[k]} onChange={()=>toggle(k)} />
                  <span className="capitalize">{k}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <button disabled={loading||!userId} onClick={save} className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  )
}
