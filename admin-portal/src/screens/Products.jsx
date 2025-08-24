import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Plus } from 'lucide-react'
import api from '../utils/api'

export default function Products() {
  // Using public products list for now; admin create/update routes exist under /products with admin role
  const { data, isLoading } = useQuery({ queryKey: ['adm-products'], queryFn: () => api.get('/products', { params: { limit: 25 } }).then(r => r.data) })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="btn btn-primary"><Plus size={16}/> New Product</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/5 dark:border-white/10">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? Array.from({length:6}) : data?.items ?? []).map((p, i) => (
                <tr key={p?._id ?? i} className="border-b last:border-none border-black/5 dark:border-white/10">
                  <td className="px-3 py-2">{p ? p.name : <div className="h-4 w-40 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{p ? `₹${p.price?.sale ?? p.price}` : <div className="h-4 w-16 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{p ? p.stock : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2">{p ? (p.brand || (p.categories?.[0] ?? '-')) : <div className="h-4 w-24 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                  <td className="px-3 py-2 text-right"><button className="btn btn-outline"><ChevronRight size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
