import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../utils/api'

export default function Reviews(){
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['adm-reviews'], queryFn: ()=> api.get('/reviews/admin', { params: { status: 'pending' } }).then(r=>r.data) })
  const mod = useMutation({ mutationFn: ({id, status})=> api.patch(`/reviews/${id}/status`, { status }).then(r=>r.data), onSuccess: ()=> qc.invalidateQueries({queryKey:['adm-reviews']}) })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reviews Moderation</h1>
      <div className="card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/5 dark:border-white/10">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Rating</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading ? Array.from({length:6}) : data ?? []).map((r, i) => (
              <tr key={r?._id ?? i} className="border-b last:border-none border-black/5 dark:border-white/10">
                <td className="px-3 py-2">{r ? r.productId : <div className="h-4 w-44 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{r ? r.rating : <div className="h-4 w-10 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2">{r ? (r.title||'-') : <div className="h-4 w-36 bg-emerald-100 dark:bg-white/10 rounded"/>}</td>
                <td className="px-3 py-2 space-x-2">
                  {r ? (
                    <>
                      <button onClick={()=> mod.mutate({id:r._id, status:'approved'})} className="btn btn-outline">Approve</button>
                      <button onClick={()=> mod.mutate({id:r._id, status:'rejected'})} className="btn btn-outline">Reject</button>
                    </>
                  ) : <div className="h-8 w-36 bg-emerald-100 dark:bg-white/10 rounded"/>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
