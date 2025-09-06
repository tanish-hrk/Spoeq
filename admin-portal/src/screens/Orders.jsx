import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function Orders() {
  const { data, isLoading } = useQuery({ queryKey: ['adm-orders'], queryFn: () => api.get('/orders/admin/all', { params: { limit: 25 } }).then(r => r.data) })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/5 dark:border-white/10">
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
        {(isLoading ? Array.from({length:6}) : data?.items ?? []).map((o, i) => (
                <tr key={o?._id ?? i} className="border-b last:border-none border-black/5 dark:border-white/10">
                  <td className="px-3 py-2">{o ? <Link className="text-emerald-700 underline" to={`/orders/${o._id}`}>{o._id}</Link> : <div className="h-4 w-28 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
          <td className="px-3 py-2">{o ? (o.userId || '-') : <div className="h-4 w-36 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
          <td className="px-3 py-2">{o ? `₹${o.pricing?.grandTotal ?? '-'}` : <div className="h-4 w-16 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{o ? o.status : <div className="h-4 w-20 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
