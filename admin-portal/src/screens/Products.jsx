import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronRight, Plus } from 'lucide-react'
import api from '../utils/api'
import { useToast } from '../components/Toast'

export default function Products() {
  const qc = useQueryClient()
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [editing, setEditing] = useState(null) // null or product object
  const [open, setOpen] = useState(false)
  const params = useMemo(()=> ({ page, limit: 20, search: search||undefined, sort }), [page, search, sort])
  const { data, isLoading, isFetching } = useQuery({ queryKey: ['adm-products', params], queryFn: () => api.get('/products', { params }).then(r => r.data), keepPreviousData: true })

  const createMut = useMutation({
    mutationFn: (payload)=> api.post('/products', payload).then(r=>r.data),
    onSuccess: ()=> { toast.push('Product created'); qc.invalidateQueries({ queryKey: ['adm-products'] }); setOpen(false); setEditing(null); },
    onError: (e)=> toast.push(e?.response?.data?.error || 'Create failed', { type: 'error' })
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data })=> api.patch(`/products/${id}`, data).then(r=>r.data),
    onSuccess: ()=> { toast.push('Product updated'); qc.invalidateQueries({ queryKey: ['adm-products'] }); setOpen(false); setEditing(null); },
    onError: (e)=> toast.push(e?.response?.data?.error || 'Update failed', { type: 'error' })
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search name…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} />
          <select value={sort} onChange={e=> setSort(e.target.value)}>
            <option value="-createdAt">Newest</option>
            <option value="price.sale">Price: Low to High</option>
            <option value="-price.sale">Price: High to Low</option>
            <option value="name">Name A→Z</option>
          </select>
          <button className="btn btn-primary" onClick={()=>{ setEditing(null); setOpen(true); }}><Plus size={16}/> New Product</button>
        </div>
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
                  <td className="px-3 py-2 text-right"><button className="btn btn-outline" onClick={()=>{ setEditing(p); setOpen(true); }}><ChevronRight size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 text-sm">
          <div>{isFetching ? 'Loading…' : `Page ${data?.page||page} of ${data?.totalPages||1} • ${data?.total||0} items`}</div>
          <div className="flex gap-2">
            <button className="btn btn-outline" disabled={(data?.page||page) <= 1} onClick={()=> setPage(p=> Math.max(1, p-1))}>Prev</button>
            <button className="btn btn-outline" disabled={(data?.page||page) >= (data?.totalPages||1)} onClick={()=> setPage(p=> p+1)}>Next</button>
          </div>
        </div>
      </div>

      {open && (
        <ProductModal
          product={editing}
          onClose={()=>{ setOpen(false); setEditing(null); }}
          onSave={(payload)=> editing ? updateMut.mutate({ id: editing._id, data: payload }) : createMut.mutate(payload)}
          saving={createMut.isPending || updateMut.isPending}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave, saving }){
  const [form, setForm] = useState(()=> ({
    name: product?.name || '',
    slug: product?.slug || '',
    brand: product?.brand || '',
    categories: product?.categories || [],
    price: { mrp: product?.price?.mrp ?? product?.price ?? 0, sale: product?.price?.sale ?? product?.price ?? 0 },
    stock: product?.stock ?? 0,
    sku: product?.sku || ''
  }))

  const set = (k,v)=> setForm(f=> ({ ...f, [k]: v }))
  const setPrice = (k,v)=> setForm(f=> ({ ...f, price: { ...f.price, [k]: v } }))
  const setCategories = (v)=> setForm(f=> ({ ...f, categories: v.split(',').map(s=> s.trim()).filter(Boolean) }))

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-40" onClick={onClose}>
      <div className="card w-full max-w-2xl" onClick={e=> e.stopPropagation()}>
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold">{product? 'Edit Product':'New Product'}</div>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input value={form.name} onChange={e=> set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input value={form.slug} onChange={e=> set('slug', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Brand</label>
            <input value={form.brand} onChange={e=> set('brand', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Categories (comma-separated)</label>
            <input value={form.categories.join(', ')} onChange={e=> setCategories(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">MRP</label>
            <input type="number" value={form.price.mrp} onChange={e=> setPrice('mrp', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Sale Price</label>
            <input type="number" value={form.price.sale} onChange={e=> setPrice('sale', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" value={form.stock} onChange={e=> set('stock', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input value={form.sku} onChange={e=> set('sku', e.target.value)} />
          </div>
        </div>
        <div className="p-4 border-t border-black/10 dark:border-white/10 flex gap-2 justify-end">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving} onClick={()=> onSave(form)}>{saving? 'Saving…':'Save'}</button>
        </div>
      </div>
    </div>
  )
}
