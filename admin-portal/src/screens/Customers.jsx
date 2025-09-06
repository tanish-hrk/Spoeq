import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

export default function Customers(){
  const { data, isLoading } = useQuery({ queryKey: ['adm-users'], queryFn: ()=> api.get('/auth/admin/users', { params: { limit: 25 } }).then(r=>r.data) })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/5 dark:border-white/10">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? Array.from({length:6}) : data?.items ?? []).map((u, i) => (
                <tr key={u?._id ?? i} className="border-b last:border-none border-black/5 dark:border-white/10">
                  <td className="px-3 py-2">{u ? u.email : <div className="h-4 w-44 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{u ? (u.name||'-') : <div className="h-4 w-28 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{u ? (u.role||u.roles?.[0]||'-') : <div className="h-4 w-16 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{u ? u.status : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
