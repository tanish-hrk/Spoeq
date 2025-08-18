import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';

export default function AdminRoute(){
  const user = useAuthStore(s=> s.user);
  const location = useLocation();
  if(!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if(!user.roles?.includes('admin')) return <Navigate to="/" replace />;
  return <Outlet />;
}
