import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LandingPage from "./components/LandingPage";
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { FitnessCate } from "./components/CategoryPage/FitnessCate";
import { RunningCate } from "./components/CategoryPage/RunningCate";
import { TeamSportCate } from "./components/CategoryPage/TeamSportCate";
import { TrainingCate } from "./components/CategoryPage/TrainingCate";

const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <Router>
        <div className="App bg-neutral-950 min-h-screen text-white font-[system-ui]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/fitnessCate" element={<FitnessCate />} />
            <Route path="/runningCate" element={<RunningCate />} />
            <Route path="/teamSportsCate" element={<TeamSportCate />} />
            <Route path="/trainingCate" element={<TrainingCate />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
