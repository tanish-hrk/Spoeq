import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

export default function Inventory(){
  const { data, isLoading } = useQuery({ queryKey:['adm-inv'], queryFn: ()=> api.get('/products', { params: { limit: 100, sort: 'stock' } }).then(r=>r.data) })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Inventory</h1>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/5 dark:border-white/10">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading? Array.from({length:10}) : data?.items||[]).map((p,i)=> (
              <tr key={p?._id ?? i} className="border-b last:border-none border-black/5 dark:border-white/10">
                <td className="px-3 py-2">{p? p.name: <div className="h-4 w-64 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{p? (p.sku||'-') : <div className="h-4 w-20 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{p? p.stock : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
