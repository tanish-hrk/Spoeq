import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../utils/api'

export default function OrderDetail(){
  const { id } = useParams()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey:['adm-order', id], queryFn: ()=> api.get(`/orders/admin/${id}`).then(r=>r.data) })
  const adv = useMutation({ mutationFn: ()=> api.post(`/orders/${id}/advance`).then(r=>r.data), onSuccess: ()=> qc.invalidateQueries({queryKey:['adm-order',id]}) })

  if(isLoading) return <div className="card p-4">Loading…</div>
  if(!data) return <div className="card p-4">Not found</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Order {data._id}</h1>
      <div className="card p-4">
        <div className="text-sm text-gray-500">Status</div>
        <div className="font-semibold">{data.status}</div>
        <div className="mt-4 text-sm text-gray-500">Total</div>
        <div className="font-semibold">₹{data?.pricing?.grandTotal}</div>
        <div className="mt-4">
          <button onClick={()=>adv.mutate()} className="btn btn-primary">Advance Status</button>
        </div>
      </div>
    </div>
  )
}
