import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';

export default function ProtectedRoute(){
  const user = useAuthStore(s=>s.user);
  const location = useLocation();
  if(!user){
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
