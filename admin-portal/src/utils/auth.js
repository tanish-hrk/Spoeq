import { useQuery } from '@tanstack/react-query'
import api from './api'

export function useMe(){
  return useQuery({ queryKey: ['adm-me'], queryFn: async ()=> {
    const { data } = await api.get('/auth/me')
    return data
  }, retry: false })
}

export function hasAccess(user, key){
  if(!user) return false
  const roles = user.roles || []
  if(roles.includes('owner') || roles.includes('admin')) return true
  return !!user.access?.[key]
}
