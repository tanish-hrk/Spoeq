import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LandingPage from "./components/LandingPage";
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ToastProvider } from './components/ui/ToastProvider';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Account from './pages/Account';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import { FitnessCate } from "./components/CategoryPage/FitnessCate";
import { RunningCate } from "./components/CategoryPage/RunningCate";
import { TeamSportCate } from "./components/CategoryPage/TeamSportCate";
import { TrainingCate } from "./components/CategoryPage/TrainingCate";

const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <Router>
  <ToastProvider>
  <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route element={<ProtectedRoute />}> 
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/account" element={<Account />} />
            </Route>
            <Route element={<AdminRoute />}> 
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
            </Route>
            <Route path="/fitnessCate" element={<FitnessCate />} />
            <Route path="/runningCate" element={<RunningCate />} />
            <Route path="/teamSportsCate" element={<TeamSportCate />} />
            <Route path="/trainingCate" element={<TrainingCate />} />
          </Routes>
        </AppShell>
        </ToastProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
